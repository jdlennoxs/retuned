const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const { test } = require('node:test');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const ts = require('typescript');

// Transpile this leaf component with the existing TypeScript dependency.
// Stub track/preview UI so these checks don't need browser audio or Spotify.
const filename = path.resolve(__dirname, '../src/components/Cube.tsx');
const compiled = ts.transpileModule(readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true },
}).outputText;
const componentModule = new Module(filename, module);
componentModule.filename = filename;
componentModule.paths = module.paths;
componentModule.require = (id) => {
  if (id === '@/components/Track') return { Track: ({ track }) => React.createElement('span', null, track.name) };
  if (id === './PreviewWrapper') return { PreviewWrapper: ({ children }) => children };
  return require(id);
};
componentModule._compile(compiled, filename);
const Cube = componentModule.exports.default;
const track = { name: 'Test track', preview_url: null };
const points = { valence: 0.5, energy: 0.7 };
const render = (props) => renderToStaticMarkup(React.createElement(Cube, props));

test('missing features render a fallback instead of crashing', () => {
  assert.match(render({ tracks: track }), /Track features unavailable/);
});

test('missing track renders a fallback instead of crashing', () => {
  assert.match(render({ points }), /Track features unavailable/);
});

test('loaded track renders the canvas even without a preview URL', () => {
  const html = render({ points, tracks: track });
  assert.match(html, /<canvas/);
  assert.match(html, /Test track/);
  assert.doesNotMatch(html, /Track features unavailable/);
});
