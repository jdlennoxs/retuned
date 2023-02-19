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
    <div className="absolute  flex h-screen w-screen">
      <div className="relative z-30 m-auto place-items-center ">
        <div className="flex flex-col gap-4 rounded-lg bg-white p-8 text-lg shadow-lg sm:max-w-sm">
          <h1 className="my-2 text-3xl text-[#8f83d8]">
            Re:<span className="font-semibold text-[#504A6D]">Tuned</span>
          </h1>
          <p>An easy way to discover new music.</p>
          <p>
            We tailor recommendations from your current library with what you
            want to hear right now.
          </p>
          <p>
            Simply swipe <strong>right</strong> on tracks you&apos;re feeling,
            and <strong>left</strong> on those you&apos;re not and we&apos;ll
            generate a playlist you can add to Spotify.
          </p>
          <p>Hold down to hear a snippet of the track before you swipe!</p>

          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="my-2 w-full max-w-sm rounded-full bg-[#ffda61] p-4 text-lg font-semibold text-[#504A6D]"
                onClick={() => signIn(provider.id)}
              >
                Sign in with {provider.name}
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
