import { any, equals, map, pipe, path, flatten, uniq, groupBy } from "ramda";
import { trpc } from "../utils/trpc";

export const useAllAlbumsQuery = () => {
  const { data: longTermData, isLoading: longTermIsLoading } =
    trpc.spotify.getUserTopTracks.useQuery("long_term");
  const { data: mediumTermData, isLoading: mediumTermIsLoading } =
    trpc.spotify.getUserTopTracks.useQuery("medium_term");
  const { data: shortTermData, isLoading: shortTermIsLoading } =
    trpc.spotify.getUserTopTracks.useQuery("short_term");

  const tracksByAlbum = groupBy((t) => path(["album", "id"], t), tracks) || {};

  console.log();

  return {
    data: pipe(
      map(path(["body", "items", "album"])),
      flatten,
      uniq

      // map((tracks) =>
      //   assoc("tracks", tracksByArtist[artist?.id] || [], artist)
      // ),
      // filter((artist) => artist.tracks.length)
    )([
      longTermData,
      mediumTermData,
      shortTermData,
    ]) as SpotifyApi.TrackObjectFull[],

    isLoading: any(equals(true))([
      longTermIsLoading,
      mediumTermIsLoading,
      shortTermIsLoading,
    ]),
  };
};
