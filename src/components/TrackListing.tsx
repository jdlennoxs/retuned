import Image from "next/image";
import AudioPreview from "./AudioPreview";
import { useState } from "react";

interface TrackListingProps {
  track: SpotifyApi.TrackObjectFull;
  isPlaying: boolean;
}

const getImageSize = (images: SpotifyApi.ImageObject[], size = 640) => {
  const img = images.find((image) => image.height === size) || images[0];
  return img?.url || "";
};

export const TrackListing = ({ track, isPlaying }: TrackListingProps) => {
  return (
    <div
      className={
        "m-auto w-72 place-items-center overflow-hidden rounded-2xl shadow-lg md:h-[480px] md:w-[480px]"
      }
    >
      <>
        {track?.preview_url && (
          <AudioPreview isPlaying={isPlaying} url={track.preview_url} />
        )}
        <Image
          className="pointer-events-none -z-10"
          height="640"
          width="640"
          src={getImageSize(track.album.images)}
          alt=""
        />
      </>
    </div>
  );
};
