import {
  any,
  equals,
  flatten,
  map,
  path,
  pipe,
  propEq,
  reject,
  uniq,
} from "ramda";
import { trpc } from "./trpc";
import useRecommenderStore from "./useRecommenderStore";

export const useGetListenedTracksQuery = () => {
  const {mediumLimit,mediumOffset,shortLimit,shortOffset} = useRecommenderStore((state) => state.offsets);
  const { data: mediumTracks, isLoading: isLoadingMedium } =
    trpc.spotify.getUserTopTracks.useQuery({
      timeRange: "medium_term",
      limit: mediumLimit,
      offset: mediumOffset,
    });
  const { data: shortTracks, isLoading: isLoadingShort } =
    trpc.spotify.getUserTopTracks.useQuery({
      timeRange: "short_term",
      limit: shortLimit,
      offset: shortOffset,
    });

  return {
    data: pipe(
      map(path(["body", "items"])),
      flatten,
      uniq,
      reject(propEq("preview_url", null))
    )([mediumTracks, shortTracks]) as SpotifyApi.TrackObjectFull[],

    isLoadingListened: any(equals(true))([isLoadingMedium, isLoadingShort]),
  };
};
