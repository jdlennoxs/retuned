import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { isEmpty, last, not, path, propEq, reject, uniqBy } from "ramda";
import { useEffect } from "react";

import InfiniteCards from "../components/InfiniteCards";
import Noise from "../components/Noise";
import Playlist from "../components/Playlist";
import UserInfo from "../components/UserInfo";
import recommendationParamSelector from "../utils/recommendationParameterSelector";
import { trpc } from "../utils/trpc";
import { useGetLikedTracksQuery } from "../utils/useGetLikedTracksQuery";
import { useGetListenedTracksQuery } from "../utils/useGetListenedTracksQuery";
import useRecommenderStore from "../utils/useRecommenderStore";

function shuffle(array) {
  const result = array;
  let curId = array.length;
  // There remain elements to shuffle
  while (0 !== curId) {
    // Pick a remaining element
    const randId = Math.floor(Math.random() * curId);
    curId -= 1;
    // Swap it with the current element.
    const tmp = result[curId];
    result[curId] = result[randId];
    result[randId] = tmp;
  }
  return result;
}

export default function Home() {
  const { data: session } = useSession();
  const { data: listenedTracks, isLoadingListened } =
    useGetListenedTracksQuery();
  const { data: likedTracks, isLoadingLiked } = useGetLikedTracksQuery();

  const params = useRecommenderStore(recommendationParamSelector);

  const setRecommendations = useRecommenderStore(
    (state) => state.setRecommendations
  );
  trpc.spotify.getRecommendations.useQuery(params, {
    enabled: not(isEmpty(path(["seedTracks"], params))),
    onSuccess: (data) => {
      setRecommendations(
        reject(
          propEq("preview_url", null),
          data.body.tracks
        ) as SpotifyApi.RecommendationTrackObject[]
      );
    },
  });

  const recommendations = useRecommenderStore((state) => state.recommendations);
  const chosenTracks = useRecommenderStore((state) => state.chosenTracks);
  const setFeatures = useRecommenderStore((state) => state.setFeatures);
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
  return (
    <>
      <Head>
        <title>Playlistr</title>
        <meta name="description" content="Jump into something new" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Noise />
      {/* -gradient-to-b from  to-[#393359]  */}
      <main className="min-h-screen overflow-hidden bg-[#504A6D] ">
        {!session ? (
          <>
            {" "}
            Not signed in <br />{" "}
            <button onClick={() => signIn()}>Sign in</button>{" "}
          </>
        ) : (
          <>
            <UserInfo />
            {recommendations.length === 4 ? (
              <Playlist />
            ) : (
              <>
                {isLoadingLiked || isLoadingListened ? (
                  <>Loading</>
                ) : (
                  <InfiniteCards
                    tracks={shuffle(
                      uniqBy((x) => x?.id, listenedTracks.concat(likedTracks))
                    )}
                    recommendations={
                      chosenTracks.length > 1 ? last(recommendations) || [] : []
                    }
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}
