import Image from "next/image";
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

export const Track = ({ track }: ArtistListingProps) => {
  return (
    <div>
      <ReactHoverObserver className={`m-auto max-w-xl overflow-hidden`}>
        {({ isHovering }) => (
          <>
            {track?.preview_url && (
              <AudioPreview isPlaying={isHovering} url={track?.preview_url} />
            )}
            <div className="flex items-center p-2">
              <Image
                className="h-14 w-14 object-cover shadow-sm"
                height="56"
                width="56"
                src={getImageSize(track.album.images)}
                alt=""
              />
              <div className="m-2 flex flex-col">
                <h1 className="text-lg font-semibold text-white">
                  {track.name}
                </h1>
                <h3 className="font-semibold text-[#e3e1e4]">
                  {pluck("name", track.artists).join(", ")}
                </h3>
              </div>
            </div>
          </>
        )}
      </ReactHoverObserver>
    </div>
  );
};
