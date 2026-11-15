import { uniqBy } from "ramda";
import { useState } from "react";
import { trpc } from "./trpc";
import useMatcherStore from "@/utils/useMatcherStore";

export const useGetLikedTracksQuery = () => {
  const { recentLimit } = useMatcherStore((state) => state.offsets);

  const [randomNumber] = useState(Math.random);
  const { data: meta, isLoading: isLoadingMeta } =
    trpc.spotify.getLikedTracks.useQuery({ limit: 1 });
  const maxOffset = Math.max(0, (meta?.body.total ?? 0) - 30);
  const offset = Math.floor(randomNumber * (maxOffset + 1));
  const { data: likedTracks, isInitialLoading: isLoadingLiked } =
    trpc.spotify.getLikedTracks.useQuery(
      {
        limit: 30,
        offset,
      },
      {
        enabled: !!meta,
      }
    );
  const { data: recentTracks, isLoading: isLoadingRecent } =
    trpc.spotify.getUserRecentTracks.useQuery({
      limit: recentLimit,
    });
  return {
    data: uniqBy(
      (track) => track.id,
      [...(likedTracks?.body.items ?? []), ...(recentTracks?.body.items ?? [])]
        .map((item) => item.track)
        .filter((track) => !!track.preview_url)
    ),
    isLoadingLiked: isLoadingMeta || isLoadingLiked || isLoadingRecent,
  };
};
