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
    <div>
      <ReactHoverObserver className={`m-auto max-w-xl overflow-hidden`}>
        {({ isHovering }: { isHovering: boolean }) => (
          <>
            {track?.preview_url && (
              <AudioPreview isPlaying={isHovering} url={track?.preview_url} />
            )}
            <div className="flex items-center gap-2 p-2">
              <img
                className="h-24 w-24 object-cover shadow-sm"
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
                <a
                  className="flex gap-2 py-2 text-[white]"
                  href={`https://open.spotify.com/track/${track.id}`}
                >
                  <img
                    className="h-6"
                    src="/spotify-white.png"
                    alt="Spotify logo"
                  />
                  <span>PLAY ON SPOTIFY</span>
                </a>
              </div>
            </div>
          </>
        )}
      </ReactHoverObserver>
    </div>
  );
};
