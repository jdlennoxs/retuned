/* eslint-disable @next/next/no-img-element */
import { useSession, signOut } from "next-auth/react";

const UserInfo = () => {
  const { data: session, status } = useSession();
  return (
    <>
      {status === "authenticated" ? (
        <div className="fixed top-0 w-full bg-[#504A6D] p-2 text-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              Re:<span className="font-semibold">Tuned</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => signOut()}>Sign out</button>
              <img
                src={session?.user?.image || ""}
                width={36}
                height={36}
                alt=""
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default UserInfo;
