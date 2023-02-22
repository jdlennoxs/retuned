import { uniqBy } from "ramda";
import { useEffect } from "react";
import { shuffle } from "../utils/shuffle";
import { useGetLikedTracksQuery } from "../utils/useGetLikedTracksQuery";
import { useGetListenedTracksQuery } from "../utils/useGetListenedTracksQuery";
import useRecommenderStore from "../utils/useRecommenderStore";
import InfiniteCards from "./InfiniteCards";
import Loading from "./Loading";

const SwipeableTrackCards = () => {
  const { hasSeedTracks, seedTracks, setHasSeedTracks, setSeedTracks } =
    useRecommenderStore();
  const { data: listenedTracks, isLoadingListened } =
    useGetListenedTracksQuery();
  const { data: likedTracks, isLoadingLiked } = useGetLikedTracksQuery();

  // Update the seed data only once
  useEffect(() => {
    if (!isLoadingLiked && !isLoadingListened && !hasSeedTracks) {
      setHasSeedTracks();
      setSeedTracks(
        shuffle(uniqBy((x) => x?.id, listenedTracks.concat(likedTracks)))
      );
    }
  }, [
    hasSeedTracks,
    isLoadingLiked,
    isLoadingListened,
    likedTracks,
    listenedTracks,
    setHasSeedTracks,
    setSeedTracks,
  ]);

  return (
    <div className="relative z-20 m-auto mt-32 flex justify-center">
      {hasSeedTracks ? <InfiniteCards seedTracks={seedTracks} /> : <Loading />}
    </div>
  );
};

export default SwipeableTrackCards;
