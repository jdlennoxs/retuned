import Image from "next/image";
import ReactHoverObserver from "react-hover-observer";
import AudioPreview from "./AudioPreview";

interface ArtistListingProps {
  artist: SpotifyArtist;
}

const getImageSize = (images: SpotifyApi.ImageObject[], size = 300) => {
  const img = images.find((image) => image.height === size) || images[0];
  return img?.url || "";
};

export const ArtistListing = ({ artist }: ArtistListingProps) => {
  return (
    <div
      className={`translate-x-[${Math.floor(
        Math.random() * 3
      )}px] translate-y-[${Math.floor(Math.random() * 3)}px]`}
    >
      <ReactHoverObserver
        className={`mb-4 h-[250px] w-[200px] overflow-hidden rounded-lg shadow-md`}
      >
        {({ isHovering }) => (
          <>
            {artist?.tracks[0]?.preview_url && (
              <AudioPreview
                isPlaying={isHovering}
                url={artist?.tracks[0]?.preview_url}
              />
            )}

            <Image
              className="-z-10 h-[250px] w-[200px] rounded-3xl border-[12px] border-white object-cover shadow-sm"
              height="300"
              width="300"
              src={getImageSize(artist.images)}
              alt=""
            />
          </>
        )}
      </ReactHoverObserver>

      <div>
        <h3
          style={{ textShadow: "1px 2px 2px black" }}
          className="-mt-12 -ml-2 -rotate-3 text-center text-xl font-bold text-zinc-100 shadow-sm"
        >
          {artist.name}
        </h3>
        {/* <p className="text-l font-semibold text-zinc-200">
          {artist?.tracks?.length}
        </p> */}
      </div>
    </div>
  );
};
