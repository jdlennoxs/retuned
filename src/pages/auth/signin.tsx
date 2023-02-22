import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="absolute flex h-screen w-screen">
      <div className="relative z-30 m-auto place-items-center ">
        <div className="flex flex-col gap-4 rounded-lg bg-white p-12 text-lg text-[#504A6D] shadow-lg sm:max-w-sm">
          <h1 className="my-2 text-3xl text-[#8f83d8]">
            Re:<span className="font-semibold text-[#504A6D]">Tuned</span>
          </h1>
          <h3 className="-mt-4 font-semibold text-[#8f83d8]">
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
            For better results try to keep your choices similar. e.g. Ballads,
            upbeat songs, dance music.
          </p>
          <p>Get started by logging in with Spotify.</p>

          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="my-2 flex w-full max-w-sm justify-center gap-2 rounded-full bg-[#1ed760] p-4 text-lg font-semibold text-[white] hover:scale-105 active:scale-95"
                onClick={() => signIn(provider.id)}
              >
                <img
                  className="h-6"
                  src="/spotify-white.png"
                  alt="Spotify logo"
                />
                SIGN IN WITH SPOTIFY
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
