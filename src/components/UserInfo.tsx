/* eslint-disable @next/next/no-img-element */
import { useSession, signOut } from "next-auth/react";

const UserInfo = () => {
  const { data: session, status } = useSession();
  return (
    <div className="z-30 w-full p-2 text-white ">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="h-9 w-9"
          >
            <path
              stroke-linecap="round"
              stroke="#8f83d8"
              stroke-linejoin="round"
              d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
            />
          </svg>
          <div className="p-2 text-xl">
            Re:<span className="font-semibold">Tuned</span>
          </div>
        </div>
        {status === "authenticated" ? (
          <div className="flex gap-2 p-2">
            <button onClick={() => signOut()}>Sign out</button>
            <img
              src={session?.user?.image || ""}
              width={36}
              height={36}
              alt=""
              className="rounded-full"
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
