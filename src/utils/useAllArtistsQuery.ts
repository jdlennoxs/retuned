import { any, equals, map, pipe, path, flatten, uniq } from "ramda";
import { trpc } from "../utils/trpc";

export const useAllArtistsQuery = () => {
  const { data: longTermData, isLoading: longTermIsLoading } =
    trpc.spotify.getUserTopArtists.useQuery("long_term");
  const { data: mediumTermData, isLoading: mediumTermIsLoading } =
    trpc.spotify.getUserTopArtists.useQuery("medium_term");
  const { data: shortTermData, isLoading: shortTermIsLoading } =
    trpc.spotify.getUserTopArtists.useQuery("short_term");

  return {
    data: pipe(
      map(path(["body", "items"])),
      flatten,
      uniq
    )([
      longTermData,
      mediumTermData,
      shortTermData,
    ]) as SpotifyApi.ArtistObjectFull[],

    isLoading: any(equals(true))([
      longTermIsLoading,
      mediumTermIsLoading,
      shortTermIsLoading,
    ]),
  };
};
