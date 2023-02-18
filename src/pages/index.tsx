import { signIn, useSession } from "next-auth/react";
import { last, propEq, reject } from "ramda";
import { useEffect } from "react";
import Playlist from "../components/Playlist";
import SwipeableTrackCards from "../components/SwipeableTrackCards";
import recommendationParamSelector from "../utils/recommendationParameterSelector";

import { trpc } from "../utils/trpc";
import useRecommenderStore from "../utils/useRecommenderStore";

export default function Home() {
  const { status } = useSession();
  const { chosenTracks, setFeatures, step } = useRecommenderStore();
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [status]);

  const params = useRecommenderStore(recommendationParamSelector);

  const setRecommendations = useRecommenderStore(
    (state) => state.setRecommendations
  );
  trpc.spotify.getRecommendations.useQuery(params, {
    enabled: params.seedTracks !== undefined,
    onSuccess: (data) => {
      setRecommendations(
        reject(
          propEq("preview_url", null),
          data.body.tracks
        ) as SpotifyApi.RecommendationTrackObject[]
      );
    },
  });

  trpc.spotify.getTrackFeatures.useQuery(last(chosenTracks)?.id || "", {
    enabled: !!last(chosenTracks)?.id,
    onSuccess: (data) => {
      setFeatures(data.body);
    },
  });

  // #585273
  // #8e88a1
  // #8f83d8
  // #e3e1e4
  return <>{step === "Finished" ? <Playlist /> : <SwipeableTrackCards />}</>;
}
