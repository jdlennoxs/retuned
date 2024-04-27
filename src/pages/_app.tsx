import { type Session } from "next-auth";
import { getSession, SessionProvider } from "next-auth/react";
import PlausibleProvider from "next-plausible";
import { type AppType } from "next/app";
import { trpc } from "../utils/trpc";
import Head from "next/head";
import { Suspense, useState } from "react";
import UserInfo from "../components/UserInfo";
import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <PlausibleProvider
      domain="retuned.jdlennoxs.com"
      selfHosted={true}
      customDomain="https://analytics.jdlennoxs.com"
    >
      <SessionProvider session={session}>
        <Head>
          <title>Re:Tuned</title>
          <meta
            name="description"
            content="Match with new music just for you"
          />
          <link rel="icon" href="/favicon.svg" />
        </Head>
        <main className="grid h-screen grid-rows-[auto_1fr_auto] overflow-hidden bg-[#504A6D]">
          <Suspense>
            <UserInfo openInfo={setIsOpen} isOpen={isOpen} />
            <Component {...pageProps} isOpen={isOpen} closeInfo={setIsOpen} />
            <div className="self-end justify-self-end p-2">
              <span className="text-xs text-white">Created by Jack Scott</span>
            </div>
          </Suspense>
        </main>
      </SessionProvider>
    </PlausibleProvider>
  );
};

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    session: await getSession(ctx),
  };
};

export default trpc.withTRPC(MyApp);
