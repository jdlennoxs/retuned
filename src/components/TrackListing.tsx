import Image from "next/image";
import AudioPreview from "./AudioPreview";

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
    <div className={"relative m-auto place-items-center p-2"}>
      <>
        {track?.preview_url && (
          <AudioPreview isPlaying={isPlaying} url={track.preview_url} />
        )}
        <Image
          className="object pointer-events-none -z-10 overflow-hidden rounded-2xl  shadow-lg"
          height={480}
          width={480}
          src={getImageSize(track.album.images)}
          alt=""
        />
      </>
    </div>
  );
};
