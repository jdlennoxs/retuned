import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

export const time_range = z.enum(["long_term", "medium_term", "short_term"]);

export const spotifyRouter = router({
  getUserTopTracks: protectedProcedure
    .input(
      z.object({
        timeRange: time_range,
        limit: z.number().max(50).optional(),
        offset: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.spotify.getMyTopTracks({
        time_range: input.timeRange,
        limit: input.limit || 50,
        offset: input.offset || 0,
      });
    }),
  getRecommendations: protectedProcedure
    .input(
      z.object({
        seedArtists: z.string().optional(),
        seedTracks: z.string().optional(),
        target_valence: z.number().optional(),
        target_energy: z.number().optional(),
        target_danceability: z.number().optional(),
        target_acousticness: z.number().optional(),
        target_loudness: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.spotify.getRecommendations({
        limit: 26,
        seed_artists: input.seedArtists,
        seed_tracks: input.seedTracks,
      });
    }),
  getTrackFeatures: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.spotify.getAudioFeaturesForTrack(input);
    }),
  getLikedTracks: protectedProcedure
    .input(
      z.object({ limit: z.number().optional(), offset: z.number().optional() })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.spotify.getMySavedTracks({
        limit: input.limit || 25,
        offset: input.offset || 0,
      });
    }),
  getUserRecentTracks: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.spotify.getMyRecentlyPlayedTracks({
        limit: input.limit || 10,
        before: new Date().setHours(0, 0, 0, 0).valueOf(),
      });
    }),
  postPlaylist: protectedProcedure
    .input(z.object({ tracks: z.string().array(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.spotify.createPlaylist(input.name);
      await ctx.spotify.addTracksToPlaylist(res.body.id, input.tracks);
      return res.body.uri;
    }),
});
