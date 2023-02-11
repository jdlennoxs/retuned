import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { getSession, SessionProvider, signIn } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { useEffect } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    session: await getSession(ctx),
  };
};

export default trpc.withTRPC(MyApp);
