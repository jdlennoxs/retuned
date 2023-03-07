import { type Session } from "next-auth";
import { getSession, SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";

import Head from "next/head";
import UserInfo from "../components/UserInfo";
import "../styles/globals.css";
import { Suspense, useState } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Re:Tuned</title>
        <meta name="description" content="Match with new music just for you" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="grid h-screen grid-rows-[auto_1fr_auto] overflow-hidden bg-[#504A6D]">
        <Suspense>
          <UserInfo openInfo={setIsOpen} isOpen={isOpen} />
          <Component {...pageProps} isOpen={isOpen} closeInfo={setIsOpen} />
          <div className="justify-self-end p-2">
            <span className="text-xs text-white">Created by Jack Scott</span>
          </div>
        </Suspense>
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
