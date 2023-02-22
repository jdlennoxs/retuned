/* eslint-disable @next/next/no-img-element */
import { pluck } from "ramda";
import ReactHoverObserver from "react-hover-observer";
import AudioPreview from "./AudioPreview";

interface ArtistListingProps {
  track: SpotifyApi.TrackObjectFull;
}

const getImageSize = (images: SpotifyApi.ImageObject[], size = 300) => {
  const img = images.find((image) => image.height === size) || images[0];
  return img?.url || "";
};

export const PlaylistTrack = ({ track }: ArtistListingProps) => {
  return (
    <div className="flex items-center justify-between">
      <ReactHoverObserver className={`m-auto max-w-xl grow overflow-hidden`}>
        {({ isHovering }: { isHovering: boolean }) => (
          <>
            {track?.preview_url && (
              <AudioPreview isPlaying={isHovering} url={track?.preview_url} />
            )}
            <div className="flex items-center gap-4 p-2 ">
              <img
                className="h-20 w-20 object-cover shadow-sm"
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
      <a
        className="shrink-0"
        href={`https://open.spotify.com/track/${track.id}`}
      >
        <img className="h-6" src="/spotify-white.png" alt="Spotify logo" />
        {/* <span className="text-xs">OPEN SPOTIFY</span> */}
      </a>
    </div>
  );
};
