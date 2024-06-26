import { signIn, useSession } from "next-auth/react";
import { any, equals, last } from "ramda";
import { useEffect } from "react";
import Info from "../components/Info";
import Playlist from "../components/Playlist";
import SwipeableTrackCards from "../components/SwipeableTrackCards";
import recommendationParamSelector from "../utils/recommendationParameterSelector";

import { trpc } from "../utils/trpc";
import useRecommenderStore from "../utils/useRecommenderStore";

export default function Home({ isOpen, closeInfo }) {
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

  const { isFetching: isFetchingFeature } =
    trpc.spotify.getTrackFeatures.useQuery(last(chosenTracks)?.id || "", {
      enabled: !!last(chosenTracks)?.id,
      onSuccess: (data) => {
        setFeatures(data.body);
      },
    });
  const { isFetching: isFetchingRecommendation } =
    trpc.spotify.getRecommendations.useQuery(params, {
      enabled: params.seedTracks !== undefined && features.length !== 3,
      onSuccess: (data) => {
        setRecommendations(
          data.body.tracks as SpotifyApi.RecommendationTrackObject[]
        );
      },
    });

  const isFinished = step === "Finished";

  return (
    <>
      {isOpen && <Info closeInfo={closeInfo} />}
      {status === "authenticated" && (
        <>
          {!isFinished && <SwipeableTrackCards />}
          {isFinished && (
            <Playlist
              isLoading={any(equals(true))([
                isFetchingFeature,
                isFetchingRecommendation,
              ])}
            />
          )}
        </>
      )}
    </>
  );
}
