import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { getSession, SessionProvider, signIn } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import Head from "next/head";
import Noise from "../components/Noise";
import UserInfo from "../components/UserInfo";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Re:Tuned</title>
        <meta
          name="description"
          content="Discover your new musical obsession"
        />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      {/* <Noise /> */}
      <main className="min-h-screen overflow-hidden bg-[#504A6D]">
        <UserInfo />
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    session: await getSession(ctx),
  };
};

export default trpc.withTRPC(MyApp);
