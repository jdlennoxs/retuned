/* eslint-disable @next/next/no-img-element */
import { pluck } from "ramda";

const getImageSize = (images: SpotifyApi.ImageObject[], size = 300) => {
  const img = images.find((image) => image.height === size) || images[0];
  return img?.url || "";
};

export const Track = ({
  track,
  onClick,
}: {
  track: SpotifyApi.TrackObjectFull;
  onClick?: () => void;
}) => {
  return (
    <>
      <div className="flex items-center gap-4 p-2 cursor-pointer" onClick={onClick} >
        <img
          className="h-16 w-16 object-cover shadow-sm"
          height="56"
          width="56"
          src={getImageSize(track.album.images)}
          alt=""
        />
        <div className="flex flex-col">
          <h1 className="font-semibold text-white">{track.name}</h1>
          <h3 className=" text-light">
            {pluck("name", track.artists).join(", ")}
          </h3>
        </div>
      </div>
    </>
  );
};
