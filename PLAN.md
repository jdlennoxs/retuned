# Re:Tuned hub + Pathfinder

## Goal

Keep the existing Re:Tuned swipe experience intact, and give the same app a small home page linking to other music tools. Share Spotify login/client configuration and reusable UI, but keep each tool's journey state separate.

**Pathfinder** is the working name (possibly **Constellation** later). It lives at `/path`: start with a song, explore four directional recommendations at a time, and finish with a 10-track playlist and artwork drawn from the route taken.

## What's already here

The current working tree already contains an unfinished split:

- `/` — placeholder welcome page.
- `/re/match` — existing swipe flow, using `useMatcherStore`.
- `/re/map` — prototype using `useMapperStore`; recent tracks/search → feature visualization.
- `Search.tsx` — already supports recent listening and searching, and selects into the mapper store.
- `FeatureMap.tsx` — reads the selected song's audio features, but its recommendation query is commented out.
- `Playlist.tsx` — existing results, previews, Spotify links, and save action; currently tied directly to the matcher store.
- Shared Spotify tRPC endpoints already exist. Recommendation target fields are accepted but **not forwarded** to Spotify. Recent listening currently excludes everything since midnight.

Preserve existing uncommitted work. Reuse the mapper prototype as the starting point, not a second wholesale copy of Re:Tuned.

## Routes and boundaries

| Route | Purpose |
| --- | --- |
| `/` | Small tool hub: Re:Tuned and Pathfinder cards |
| `/re/match` | Re:Tuned, unchanged |
| `/path` | Pathfinder's start → exploration → results flow |
| `/re/map` | Existing prototype; redirect to `/path` once replaced |

Use the existing NextAuth session, Spotify app credentials, and backend. No second OAuth app or login flow. Share track display, previews, loading/error UI, and playlist presentation; keep matcher and Pathfinder stores separate. Reuse/reshape `useMapperStore` for Pathfinder rather than introducing another redundant store. Avoid a generic multi-tool framework.

## Small implementation stages

### 1. Check the API and preserve the baseline

- Smoke-test `/re/match` and record existing failures before touching it.
- Verify this Spotify client's actual access to recommendations and audio features. Directional exploration depends on both; login/search working does not prove access.
- Verify recent listening and playlist capabilities independently. If directional data is unavailable, stop and choose a viable data source/approach rather than simulate musical labels.

### 2. Add the hub and isolated route

- Replace the welcome placeholder with two tool cards and simple navigation back to the hub.
- Bring the existing mapper start screen to `/path`: choose a recent track or search for one.
- Auth-gate its queries; add loading, empty, and retry states. Fetch genuinely recent tracks rather than only tracks before today's midnight.
- Isolate all Pathfinder mutations/reset behavior from the matcher store. No design overhaul of Re:Tuned.

### 3. Build one exploration step, then repeat

- Place the starting track at the center of a 2D grid.
- Show four mystery dots around the current track, with directional labels rather than song identities.
- Proposed first axes: **happier ↔ sadder** (valence), **higher ↔ lower energy** (energy). Tempo/faster/slower remains an alternative; settle this after verifying data. Do not equate energy with genre/heaviness.
- Get candidates relative to the current song, with meaningful directional feature constraints. Forward the selected targets to the backend API and check returned features rather than promising direction from a generic recommendation response.
- Choose four distinct, unvisited candidates. If a direction has no credible result, show it unavailable/retry; don't silently mislabel a song.
- Selecting a dot appends exactly one track, reveals it as the new current song, and fades the old song down to a visited dot. Keep the connecting path visible and show four new choices around the new current position.
- Store ordered track IDs, grid positions, and directions explicitly. Lock selection during transitions/fetches and discard stale responses. Handle revisiting a grid coordinate without hiding or overwriting previous steps.
- Finish at **10 tracks total: the starting song + nine choices** (proposed counting rule).

### 4. Reuse the results screen

- Make `Playlist.tsx` accept tracks, title, reset callback, and optional artwork as props while retaining its existing shared save flow.
- Keep a matcher wrapper supplying Re:Tuned's existing state and behavior. Pathfinder supplies its own ordered 10-track list, without appending extra recommendations.
- Keep previews and Spotify track links usable when a preview URL is missing.
- **Saving confirmed:** Pathfinder uses the exact same “Add to Spotify” → “Open Spotify” flow and `postPlaylist` mutation as Re:Tuned. Share that implementation rather than creating a separate save system; leave Re:Tuned's behavior unchanged.

### 5. Turn the journey into artwork

- Draw the stored points and connecting line as a simple, square SVG constellation, fitted to the full path with padding.
- Display it as the playlist picture on Pathfinder's results screen. No image-generation service needed.
- On save, export the same drawing as JPEG and upload it as the playlist cover, after checking permissions/API limits. Extend the shared save flow only as needed for Pathfinder's optional artwork. Treat image-upload failure separately from playlist creation so retrying artwork cannot create duplicate playlists.

## MVP checks

- One login works across both tools; switching/resetting Pathfinder never changes Re:Tuned's choices.
- Recent/search selection starts the route at the origin.
- Each choice advances once; nine choices yield ten unique tracks in selection order.
- Missing candidates, request failures, repeated clicks, and absent previews do not corrupt the journey.
- Results and artwork represent the same recorded path, including intersecting/revisited coordinates.
- Pathfinder saves its ordered 10-track playlist through the same save flow as Re:Tuned and opens the created playlist in Spotify.
- Re:Tuned's existing swipe/results/save flow still behaves as before.

## Deferred / decisions to confirm

- Final name and exact axis labels.
- Whether the seed counts toward ten (plan assumes yes).
- Undo, branching, persistent journeys, accounts/history, and additional tools. Ship one linear journey first.
