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
  const { chosenTracks, setFeatures, step, features } = useRecommenderStore();
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [status]);

  const params = useRecommenderStore(recommendationParamSelector);

  const setRecommendations = useRecommenderStore(
    (state) => state.setRecommendations
  );

  trpc.spotify.getTrackFeatures.useQuery(last(chosenTracks)?.id || "", {
    enabled: !!last(chosenTracks)?.id,
    onSuccess: (data) => {
      setFeatures(data.body);
    },
  });
  trpc.spotify.getRecommendations.useQuery(params, {
    enabled: params.seedTracks !== undefined && features.length !== 3,
    onSuccess: (data) => {
      setRecommendations(
        data.body.tracks as SpotifyApi.RecommendationTrackObject[]
      );
    },
  });

  return (
    <>
      {step === "Finished" ? (
        <Playlist />
      ) : (
        <div className="fixed top-14 left-0 right-0 bottom-0 z-30">
          <SwipeableTrackCards />
        </div>
      )}
    </>
  );
}
