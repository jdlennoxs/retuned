import { uniqBy } from "ramda";
import { useMemo } from "react";
import { shuffle } from "./shuffle";
import { trpc } from "./trpc";
import useMatcherStore from "@/utils/useMatcherStore";

export const useGetListenedTracksQuery = () => {
  const { mediumLimit, shortLimit } = useMatcherStore(
    (state) => state.offsets
  );
  const { data: mediumTracks, isLoading: isLoadingMedium } =
    trpc.spotify.getUserTopTracks.useQuery({
      timeRange: "medium_term",
      limit: 50,
      offset: 0,
    });
  const { data: shortTracks, isLoading: isLoadingShort } =
    trpc.spotify.getUserTopTracks.useQuery({
      timeRange: "short_term",
      limit: 50,
      offset: 0,
    });

  const data = useMemo(() => {
    const medium = shuffle((mediumTracks?.body.items ?? [])
      .filter((track) => !!track.preview_url)).slice(0, mediumLimit);
    const short = shuffle((shortTracks?.body.items ?? [])
      .filter((track) => !!track.preview_url)).slice(0, shortLimit);
    return uniqBy((track) => track.id, medium.concat(short));
  }, [mediumTracks, shortTracks, mediumLimit, shortLimit]);

  return {
    data,
    isLoadingListened: isLoadingMedium || isLoadingShort,
  };
};
