import { head, last, pluck, uniqBy } from "ramda";
import recommendationParamSelector from "../utils/recommendationParameterSelector";
import { trpc } from "../utils/trpc";
import useRecommenderStore from "../utils/useRecommenderStore";
import { Track } from "./ArtistListing";
import { motion } from "framer-motion";
import { useState } from "react";
//["#8f83d8", "#393359", "#ffc661"]
const Playlist = () => {
  const [rand] = useState(Math.floor(Math.random()));
  const { chosenTracks, recommendations, removeAll } = useRecommenderStore(
    (state) => state
  );

  const { targetEnergy, targetValence } = useRecommenderStore(
    recommendationParamSelector
  );

  const titles = {
    blue: ["Melancholy", "Gloomy", "Despondent"],
    green: ["Moody", "Unpredictable", "Diverse"],
    yellow: ["Chill", "Cool", "Soothing"],
    red: ["Life Affirming", "Lively", "Exilharating"],
  };

  const getTitle = (name) => {
    if (targetValence < 0.5) {
      if (targetEnergy < 0.5) {
        return `${titles.blue[rand * titles.blue.length]} ${name}`;
      }
      return `${titles.green[rand * titles.green.length]} ${name}`;
    }
    if (targetEnergy < 0.5) {
      return `${titles.yellow[rand * titles.yellow.length]} ${name}`;
    }
    return `${titles.red[rand * titles.red.length]} ${name}`;
  };
  const final = last(recommendations) || [];
  const playlist = uniqBy((x) => x?.id, chosenTracks.concat(final as any[]));
  const createPlaylist = trpc.spotify.postPlaylist.useMutation();
  const handleCreate = async () => {
    const tracks = pluck("uri", playlist);
    createPlaylist.mutate({ tracks, name: getTitle(head(playlist).name) });
  };

  const getLink = () =>
    `https://open.spotify.com/playlist/${createPlaylist.data}`;

  return (
    <>
      <div className="my-16 text-center text-white">
        <h3 className="text-lg font-bold">Your playlist is complete.</h3>
        <h1 className="text-xl font-bold">{getTitle(head(playlist).name)}</h1>
      </div>
      <div className="mx-auto mb-60 max-w-sm flex-col">
        {playlist?.map((track, index) => (
          <motion.div
            className="px-4"
            key={track.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 1 + 0.1 * index }}
          >
            <Track track={track} />
          </motion.div>
        ))}
        <div className="fixed left-0 bottom-0">
          <div className="h-20 bg-gradient-to-t from-[#504A6D] to-transparent"></div>
          <div className="flex w-screen flex-col items-center gap-4 bg-[#504A6D] p-4">
            {createPlaylist.isSuccess ? (
              <button className="w-full max-w-sm rounded-full bg-[#ffda61] p-4 text-lg font-semibold text-[#504A6D]">
                <a href={getLink()} target="_blank" rel="noreferrer">
                  Go to playlist
                </a>
              </button>
            ) : (
              <button
                className="w-full max-w-sm rounded-full bg-[#ffda61] p-4 text-lg font-semibold  text-[#504A6D]"
                onClick={handleCreate}
              >
                Add playlist to Spotify
              </button>
            )}
            <button
              className="w-full max-w-sm rounded-full bg-[#8f83d8] p-4 text-lg font-semibold  text-white"
              onClick={removeAll}
            >
              Start again
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Playlist;
