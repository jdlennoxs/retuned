import { head, last, pluck, uniq } from "ramda";
import recommendationParamSelector from "../utils/recommendationParameterSelector";
import { trpc } from "../utils/trpc";
import useRecommenderStore from "../utils/useRecommenderStore";
import { Track } from "./ArtistListing";
import { motion } from "framer-motion";
//["#8f83d8", "#393359", "#ffc661"]
const Playlist = () => {
  const { chosenTracks, recommendations, removeAll } = useRecommenderStore(
    (state) => state
  );

  const { targetEnergy, targetValence } = useRecommenderStore(
    recommendationParamSelector
  );

  const titles = {
    blue: ["Melancholy", "Gloomy", "Despondent"],
    green: ["Moody", "Poignant", "Diverse"],
    yellow: ["Chill", "Cool", "Soothing"],
    red: ["Life Affirming", "Lively", "Exilharating"],
  };

  const getTitle = (name) => {
    if (targetValence < 0.5) {
      if (targetEnergy < 0.5) {
        return `${
          titles.blue[Math.floor(Math.random() * titles.blue.length)]
        } ${name}`;
      }
      return `${
        titles.green[Math.floor(Math.random() * titles.green.length)]
      } ${name}`;
    }
    if (targetEnergy < 0.5) {
      return `${
        titles.yellow[Math.floor(Math.random() * titles.yellow.length)]
      } ${name}`;
    }
    return `${
      titles.red[Math.floor(Math.random() * titles.red.length)]
    } ${name}`;
  };
  const final = last(recommendations) || [];
  const playlist = uniq(chosenTracks.concat(final as any[]));
  const createPlaylist = trpc.spotify.postPlaylist.useMutation();
  const handleCreate = async () => {
    const tracks = pluck("uri", playlist);
    createPlaylist.mutate({ tracks, name: getTitle(head(playlist).name) });
  };

  const getLink = () =>
    `https://open.spotify.com/playlist/${createPlaylist.data}`;

  return (
    <>
      <div className="my-20 text-center  text-white">
        <h3 className="text-lg font-bold">Your playlist is complete.</h3>
        <h1 className="text-xl font-bold">{getTitle(head(playlist).name)}</h1>
      </div>
      <div className="mb-72 flex-col justify-center">
        {playlist?.map((track, index) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 1 + 0.1 * index }}
          >
            <Track track={track} />
          </motion.div>
        ))}
        <div className="fixed bottom-0">
          <div className="h-20 bg-gradient-to-t from-[#393359] to-transparent"></div>
          <div className="flex w-screen flex-col items-center gap-6 bg-[#393359] p-8">
            {createPlaylist.isSuccess ? (
              <button className="w-full max-w-xl rounded-lg bg-[#ffc661] p-4 text-lg font-semibold text-[#393359]">
                <a href={getLink()} target="_blank" rel="noreferrer">
                  Go to playlist
                </a>
              </button>
            ) : (
              <button
                className="w-full max-w-xl rounded-lg bg-[#ffc661] p-4 text-lg font-semibold text-[#393359]"
                onClick={handleCreate}
              >
                Add playlist to Spotify
              </button>
            )}
            <button
              className="w-full max-w-xl rounded-lg bg-[#8f83d8] p-4 text-lg"
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
