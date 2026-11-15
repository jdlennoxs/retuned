import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import Info from "../components/Info";


export default function Home({ isOpen, closeInfo }) {
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [status]);

  return (
    <>
      {isOpen && <Info closeInfo={closeInfo} />}
      {status === "authenticated" && (
        <>
          <h1>Welcome to the Spotify Recommender</h1>
        </>
      )}
    </>
  );
}
