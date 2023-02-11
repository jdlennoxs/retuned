import { last, pluck, uniq } from "ramda";
import { trpc } from "../utils/trpc";
import useRecommenderStore from "../utils/useRecommenderStore";
import { Track } from "./ArtistListing";
//["#8f83d8", "#393359", "#ffc661"]
const Playlist = () => {
  const chosenTracks = useRecommenderStore((state) => state.chosenTracks);
  const recommendations = useRecommenderStore((state) => state.recommendations);
  const playlist = uniq(chosenTracks.concat(last(recommendations)));
  console.log(playlist);
  const createPlaylist = trpc.spotify.postPlaylist.useMutation();
  const handleCreate = async () => {
    const tracks = pluck("uri", playlist);
    createPlaylist.mutate(tracks);
  };

  return (
    <div className="mb-56 flex-col justify-center">
      {playlist?.map((track) => (
        <Track track={track} key={track.id} />
      ))}
      <div className="fixed bottom-0">
        <div className="h-20 bg-gradient-to-t from-[#393359] to-transparent"></div>
        <div className="flex w-screen flex-col items-center gap-4 bg-[#393359] p-4">
          <button
            className="w-full max-w-xl rounded-lg bg-[#ffc661] p-4 font-semibold text-[#393359]"
            onClick={handleCreate}
          >
            Add playlist to Spotify
          </button>
          <button className=" w-full max-w-xl rounded-lg bg-[#8f83d8] p-4">
            Start again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
