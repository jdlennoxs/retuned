import { usePlausible } from "next-plausible";

const Info = ({ closeInfo }) => {
  const plausible = usePlausible();
  return (
    <div
      className="absolute z-30 flex h-screen w-screen cursor-pointer bg-plum/[0.5]"
      onClick={() => {
        plausible("closeInfo");
        closeInfo(false);
      }}
    >
      <div className="relative  m-auto place-items-center ">
        <div className="flex flex-col gap-4 rounded-lg bg-white p-12 text-lg text-plum shadow-lg sm:max-w-sm">
          <h1 className="my-2 text-3xl text-lilac">
            Re:<span className="font-semibold text-plum">Tuned</span>
          </h1>
          <h3 className="-mt-4 font-semibold text-lilac">
            Match with new music just for you.
          </h3>
          <p>Get a tailored playlist of new music based on your library.</p>
          <p>
            Simply swipe <strong>right</strong> on tracks you&apos;re feeling,
            and <strong>left</strong> on those you&apos;re not and we&apos;ll
            generate a playlist you can add to Spotify.
          </p>
          <p>Hold down to hear a snippet of the track before you swipe.</p>
          <p>
            For better results try to keep your choices on a theme. E.g. Female
            singers, upbeat vibes or songs you can dance to.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Info;
