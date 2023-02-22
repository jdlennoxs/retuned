import { head, last, pluck, uniqBy } from "ramda";
import recommendationParamSelector from "../utils/recommendationParameterSelector";
import { trpc } from "../utils/trpc";
import useRecommenderStore from "../utils/useRecommenderStore";
import { PlaylistTrack } from "./PlaylistTrack";
import { motion } from "framer-motion";
import { useState } from "react";
import { getTitle } from "../utils/getTitle";
import Loading from "./Loading";
//["#8f83d8", "#393359", "#ffc661"]
const Playlist = ({ isLoading }: { isLoading: boolean }) => {
  const [randomNumber] = useState(Math.random());
  const { chosenTracks, removeAll, recommendations } = useRecommenderStore(
    (state) => state
  );

  const params = useRecommenderStore(recommendationParamSelector);

  const playlist = uniqBy(
    (x) => x?.id,
    chosenTracks.concat(last(recommendations))
  );
  const createPlaylist = trpc.spotify.postPlaylist.useMutation();
  const title = getTitle({
    name: head(playlist).name,
    targetEnergy: params.targetEnergy,
    targetValence: params.targetValence,
    randomNumber,
  });
  const handleCreate = async () => {
    const tracks = pluck("uri", playlist);
    createPlaylist.mutate({ tracks, name: title });
  };

  return (
    <>
      <div className="my-16 text-center text-white">
        <h3 className="text-lg font-bold">Your playlist is complete.</h3>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      {isLoading ? (
        <div className="-m-52 flex justify-center">
          <Loading />
        </div>
      ) : (
        <div className="mx-auto mb-52 max-w-sm flex-col">
          {playlist?.map((track, index) => (
            <motion.div
              className="px-4"
              key={track.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 1 + 0.1 * index }}
            >
              <PlaylistTrack track={track} />
            </motion.div>
          ))}
        </div>
      )}
      <div className="fixed left-0 bottom-0">
        <div className="h-20 bg-gradient-to-t from-[#504A6D] to-transparent"></div>
        <div className="flex w-screen flex-col items-center gap-4 bg-[#504A6D] p-4 pb-8">
          {createPlaylist.isSuccess ? (
            <button className="w-full max-w-sm rounded-full bg-[white] p-4 text-lg font-semibold text-[#504A6D]">
              <a
                href={createPlaylist.data}
                className="flex justify-center gap-2"
              >
                <img className="h-6" src="/spotify.png" alt="Spotify logo" />
                OPEN SPOTIFY
              </a>
            </button>
          ) : (
            <button
              className="flex w-full max-w-sm justify-center gap-2 rounded-full bg-[white] p-4 text-lg font-semibold text-[#504A6D]"
              onClick={handleCreate}
            >
              {createPlaylist.isLoading ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6 animate-bounce-slow"
                >
                  <path
                    strokeLinecap="round"
                    stroke="#504A6D"
                    strokeLinejoin="round"
                    d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                  />
                </svg>
              ) : (
                <>
                  <img className="h-6" src="/spotify.png" alt="Spotify logo" />
                  ADD TO SPOTIFY
                </>
              )}
            </button>
          )}
          <button
            className="w-full max-w-sm rounded-full bg-[#8f83d8] p-4 text-lg font-semibold text-white"
            onClick={removeAll}
          >
            START AGAIN
          </button>
        </div>
      </div>
    </>
  );
};

export default Playlist;
