import {
  any,
  equals,
  flatten,
  map,
  path,
  pipe,
  pluck,
  propEq,
  reject,
  uniq,
} from "ramda";
import { useState } from "react";
import { trpc } from "./trpc";
import useRecommenderStore from "./useRecommenderStore";

export const useGetLikedTracksQuery = () => {
  const { recentLimit } = useRecommenderStore((state) => state.offsets);

  const [offset, setOffset] = useState(0);
  const { isLoading: isLoadingMeta } = trpc.spotify.getLikedTracks.useQuery(
    { limit: 1 },
    {
      onSuccess: (data) => {
        setOffset(Math.floor(Math.random() * (data.body.total - 30)));
      },
      enabled: offset === 0,
    }
  );
  const { data: likedTracks, isLoading: isLoadingLiked } =
    trpc.spotify.getLikedTracks.useQuery(
      {
        limit: 30,
        offset,
      },
      {
        enabled: !!offset,
      }
    );
  const { data: recentTracks, isLoading: isLoadingRecent } =
    trpc.spotify.getUserRecentTracks.useQuery({
      limit: recentLimit,
    });
  return {
    data: !likedTracks
      ? []
      : (pipe(
          map(path(["body", "items"])),
          flatten,
          uniq,
          pluck("track"),
          reject(propEq("preview_url", null))
        )([likedTracks, recentTracks]) as SpotifyApi.TrackObjectFull[]),

    isLoadingLiked: any(equals(true))([
      isLoadingMeta,
      isLoadingLiked,
      isLoadingRecent,
    ]),
  };
};
