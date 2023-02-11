import { any, equals, flatten, path, pipe, pluck, propEq, reject } from "ramda";
import { useState } from "react";
import { trpc } from "./trpc";

export const useGetLikedTracksQuery = () => {
  const [offset, setOffset] = useState(0);
  const { isLoading: isLoadingMeta } = trpc.spotify.getLikedTracks.useQuery(
    { limit: 1 },
    {
      onSuccess: (data) => {
        if (offset === 0)
          setOffset(Math.floor(Math.random() * data.body.total) - 25);
      },
    }
  );
  const { data: likedTracks, isLoading: isLoadingLiked } =
    trpc.spotify.getLikedTracks.useQuery(
      {},
      {
        enabled: !!offset,
      }
    );
  return {
    data: !likedTracks
      ? []
      : (pipe(
          path(["body", "items"]),
          pluck("track"),
          flatten,
          reject(propEq("preview_url", null))
        )(likedTracks) as SpotifyApi.TrackObjectFull[]),

    isLoadingLiked: any(equals(true))([isLoadingMeta, isLoadingLiked]),
  };
};
