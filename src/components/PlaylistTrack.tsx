/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import { pluck } from "ramda";
import ReactHoverObserver from "react-hover-observer";
import AudioPreview from "./AudioPreview";

interface ArtistListingProps {
  track: SpotifyApi.TrackObjectFull;
  index: number;
}

const getImageSize = (images: SpotifyApi.ImageObject[], size = 300) => {
  const img = images.find((image) => image.height === size) || images[0];
  return img?.url || "";
};

export const PlaylistTrack = ({ track, index }: ArtistListingProps) => {
  return (
    <motion.div
      className="mx-auto flex max-w-sm items-center justify-between px-4"
      key={track.id}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: 1 + 0.1 * index }}
    >
      <ReactHoverObserver className={`max-w-xl grow`}>
        {({ isHovering }: { isHovering: boolean }) => (
          <>
            {track?.preview_url && (
              <AudioPreview isPlaying={isHovering} url={track?.preview_url} />
            )}
            <div className="flex items-center gap-4 p-2 ">
              <img
                className="h-16 w-16 object-cover shadow-sm"
                height="56"
                width="56"
                src={getImageSize(track.album.images)}
                alt=""
              />
              <div className=" flex flex-col">
                <h1 className="font-semibold text-white">{track.name}</h1>
                <h3 className=" text-[#e3e1e4]">
                  {pluck("name", track.artists).join(", ")}
                </h3>
              </div>
            </div>
          </>
        )}
      </ReactHoverObserver>
      <a className="shrink-0" href={track.uri}>
        <img className="h-6" src="/spotify-white.png" alt="Spotify logo" />
      </a>
    </motion.div>
  );
};
