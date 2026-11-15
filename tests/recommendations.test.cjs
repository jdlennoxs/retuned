const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');

// Exercise the real selector, tRPC auth/input validation, and router, replacing
// only the Spotify network call. Type-only imports don't load NextAuth/.env.
function load(relativePath, imports = {}) {
  const filename = path.resolve(__dirname, relativePath);
  const compiled = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = module.paths;
  loaded.require = (id) => imports[id] ?? require(id);
  loaded._compile(compiled, filename);
  return loaded.exports;
}
const select = load('../src/utils/recommendationParameterSelector.ts').default;
const trpc = load('../src/server/trpc/trpc.ts');
const { spotifyRouter } = load('../src/server/trpc/router/spotify.ts', { '../trpc': trpc });
const { getTitle } = load('../src/utils/getTitle.ts');
const state = {
  step: 'Finished',
  chosenTracks: ['one', 'two', 'three', 'four'].map(id => ({ id })),
  features: [
    { energy: 0.2, valence: 0.1, loudness: -12 },
    { energy: 0.6, valence: 0.3, loudness: -6 },
  ],
};
function fixture() {
  const calls = [];
  const result = { body: { tracks: [] } };
  const caller = spotifyRouter.createCaller({
    session: { user: { name: 'Test listener' } },
    spotify: { getRecommendations: async (options) => { calls.push(options); return result; } },
  });
  return { caller, calls, result };
}

test('calculated feature averages survive validation and reach Spotify', async () => {
  const params = select(state);
  assert.deepEqual(params, {
    seedTracks: 'three,four', target_energy: 0.4, target_valence: 0.2, target_loudness: -9,
  });
  const { caller, calls, result } = fixture();
  assert.equal(await caller.getRecommendations(params), result);
  assert.deepEqual(calls, [{
    limit: 26, seed_artists: undefined, seed_tracks: 'three,four',
    target_energy: 0.4, target_valence: 0.2, target_loudness: -9,
  }]);
  assert.equal(getTitle({
    name: 'Test track', targetEnergy: params.target_energy,
    targetValence: params.target_valence, randomNumber: 0,
  }), 'Melancholy Test track');
});

test('every supported target is forwarded, including zero', async () => {
  const { caller, calls } = fixture();
  const targets = {
    target_energy: 0, target_valence: 1, target_loudness: -20,
    target_danceability: 0.3, target_acousticness: 0.7,
  };
  await caller.getRecommendations({ seedTracks: 'one', seedArtists: 'artist', ...targets });
  assert.deepEqual(calls, [{ limit: 26, seed_tracks: 'one', seed_artists: 'artist', ...targets }]);
});

test('early steps remain seed-only', async () => {
  for (const [step, seed] of [['First', 'one'], ['Second', 'two']]) {
    const params = select({ ...state, step });
    assert.deepEqual(params, { seedTracks: seed });
    const { caller, calls } = fixture();
    await caller.getRecommendations(params);
    assert.deepEqual(calls, [{ limit: 26, seed_tracks: seed, seed_artists: undefined }]);
  }
});

test('missing features do not create NaN targets', async () => {
  const params = select({ ...state, features: [] });
  assert.deepEqual(params, { seedTracks: 'three,four' });
  const { caller, calls } = fixture();
  await caller.getRecommendations(params);
  assert.equal(calls.length, 1);
});

test('invalid targets are rejected before calling Spotify', async () => {
  const { caller, calls } = fixture();
  for (const targets of [
    { target_energy: 1.1 }, { target_valence: -0.1 },
    { target_danceability: NaN }, { target_acousticness: Infinity },
    { target_loudness: Infinity },
  ]) {
    await assert.rejects(caller.getRecommendations({ seedTracks: 'one', ...targets }), { code: 'BAD_REQUEST' });
  }
  assert.equal(calls.length, 0);
});
