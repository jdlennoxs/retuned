import {
  assoc,
  any,
  equals,
  map,
  pipe,
  path,
  flatten,
  uniq,
  groupBy,
  filter,
  keys,
  toPairs,
  pluck,
  pick,
  props,
  difference,
} from "ramda";
import { trpc } from "./trpc";

interface SpotifyArtist extends SpotifyApi.ArtistObjectFull {
  tracks?: SpotifyApi.TrackObjectFull[];
}

export const useTopQuery = () => {
  const { data: longTermArtistData, isLoading: longTermArtistIsLoading } =
    trpc.spotify.getUserTopArtists.useQuery("long_term");
  const { data: mediumTermArtistData, isLoading: mediumTermArtistIsLoading } =
    trpc.spotify.getUserTopArtists.useQuery("medium_term");
  const { data: shortTermArtistData, isLoading: shortTermArtistIsLoading } =
    trpc.spotify.getUserTopArtists.useQuery("short_term");

  const { data: longTermTrackData, isLoading: longTermTrackIsLoading } =
    trpc.spotify.getUserTopTracks.useQuery("long_term");
  const { data: mediumTermTrackData, isLoading: mediumTermTrackIsLoading } =
    trpc.spotify.getUserTopTracks.useQuery("medium_term");
  const { data: shortTermTrackData, isLoading: shortTermTrackIsLoading } =
    trpc.spotify.getUserTopTracks.useQuery("short_term");

  const tracks = pipe(
    map(path(["body", "items"])),
    flatten,
    uniq
  )([
    longTermTrackData,
    mediumTermTrackData,
    shortTermTrackData,
  ]) as SpotifyApi.TrackObjectFull[];

  const tracksByArtist =
    groupBy((t) => path(["artists", "0", "id"], t), tracks) || {};

  return {
    data: pipe(
      map(path(["body", "items"])),
      flatten,
      uniq,
      map((artist) =>
        assoc("tracks", tracksByArtist[artist?.id] || [], artist)
      ),
      filter((artist) => artist.tracks.length)
    )([
      longTermArtistData,
      mediumTermArtistData,
      shortTermArtistData,
    ]) as SpotifyArtist[],
    extras: difference(long, filtered),

    isLoading: any(equals(true))([
      longTermArtistIsLoading,
      mediumTermArtistIsLoading,
      shortTermArtistIsLoading,
      longTermTrackIsLoading,
      mediumTermTrackIsLoading,
      shortTermTrackIsLoading,
    ]),
  };
};
