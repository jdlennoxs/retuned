import {
  any,
  equals,
  map,
  pipe,
  path,
  flatten,
  uniq,
  uniqBy,
  isEmpty,
  filter,
  reject,
  propEq,
  pluck,
} from "ramda";
import { useState } from "react";
import { trpc } from "../utils/trpc";

export const useStartTracksQuery = () => {
  const [offset, setOffset] = useState(0);
  const {
    data: mediumTermData,
    isLoading: mediumTermIsLoading,
    refetch: refetchMedium,
  } = trpc.spotify.getUserTopTracks.useQuery(
    { timeRange: "short_term", limit: 50 }
    // { enabled: false }
  );

  const {
    data: likedTracks,
    isLoading,
    refetch,
  } = trpc.spotify.getLikedTracks.useQuery(
    { offset: offset, limit: 50 }
    // {
    //   enabled: !offset,
    //   onSuccess: (data) => {
    //     setOffset(Math.floor(Math.random() * (data.body.total - 50)));
    //   },
    // }
  );

  const liked = likedTracks
    ? pipe(path(["body", "items"]), pluck("track"))(likedTracks)
    : [];
  const medium = path(["body", "items"], mediumTermData);
  return {
    data: pipe(
      flatten,
      uniq,
      reject(propEq("preview_url", null))
    )([liked, medium]) as SpotifyApi.TrackObjectFull[],

    isLoading: any(equals(true))([mediumTermIsLoading, isLoading]),
    // refetch: () => {
    //   refetchLong(), refetchMedium(), refetchShort();
    // },
  };
};
