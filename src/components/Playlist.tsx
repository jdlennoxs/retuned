import { last, pluck, uniq } from "ramda";
import { trpc } from "../utils/trpc";
import useRecommenderStore from "../utils/useRecommenderStore";
import { Track } from "./ArtistListing";
//["#8f83d8", "#393359", "#ffc661"]
const Playlist = () => {
  const chosenTracks = useRecommenderStore((state) => state.chosenTracks);
  const recommendations = useRecommenderStore((state) => state.recommendations);
  const removeAll = useRecommenderStore((state) => state.removeAll);
  const final = last(recommendations) || [];
  const playlist = uniq(chosenTracks.concat(final as any[]));
  console.log(playlist);
  const createPlaylist = trpc.spotify.postPlaylist.useMutation();
  const handleCreate = async () => {
    const tracks = pluck("uri", playlist);
    createPlaylist.mutate(tracks);
  };

  return (
    <>
      <h1 className="my-20 text-center text-xl font-bold text-white">
        Your playlist is complete.
      </h1>
      <div className="mb-56 flex-col justify-center">
        {playlist?.map((track) => (
          <Track track={track} key={track.id} />
        ))}
        <div className="fixed bottom-0">
          <div className="h-20 bg-gradient-to-t from-[#393359] to-transparent"></div>
          <div className="flex w-screen flex-col items-center gap-6 bg-[#393359] p-8">
            <button
              className="w-full max-w-xl rounded-lg bg-[#ffc661] p-4 text-lg font-semibold text-[#393359]"
              onClick={handleCreate}
            >
              Add playlist to Spotify
            </button>
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
