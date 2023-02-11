import { any, equals, flatten, map, path, pipe, propEq, reject } from "ramda";
import { trpc } from "./trpc";

export const useGetListenedTracksQuery = () => {
  const { data: mediumTracks, isLoading: isLoadingMedium } =
    trpc.spotify.getUserTopTracks.useQuery({ timeRange: "medium_term" });
  const { data: shortTracks, isLoading: isLoadingShort } =
    trpc.spotify.getUserTopTracks.useQuery({ timeRange: "short_term" });

  return {
    data: pipe(
      map(path(["body", "items"])),
      flatten,
      reject(propEq("preview_url", null))
    )([mediumTracks, shortTracks]) as SpotifyApi.TrackObjectFull[],

    isLoadingListened: any(equals(true))([isLoadingMedium, isLoadingShort]),
  };
};
