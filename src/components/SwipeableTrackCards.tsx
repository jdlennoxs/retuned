import { uniqBy } from "ramda";
import { useEffect } from "react";
import { shuffle } from "../utils/shuffle";
import { useGetLikedTracksQuery } from "../utils/useGetLikedTracksQuery";
import { useGetListenedTracksQuery } from "../utils/useGetListenedTracksQuery";
import useRecommenderStore from "../utils/useRecommenderStore";
import InfiniteCards from "./InfiniteCards";

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
    <>
      {hasSeedTracks ? (
        <InfiniteCards seedTracks={seedTracks} />
      ) : (
        <div className="flex-1 text-center text-white">Loading</div>
      )}
    </>
  );
};

export default SwipeableTrackCards;
