/* eslint-disable @next/next/no-img-element */
import { useSession, signOut } from "next-auth/react";
import { usePlausible } from "next-plausible";

interface UserInfoProps {
  openInfo: (isOpen: boolean) => void;
  isOpen: boolean;
}

const UserInfo = ({ openInfo }: UserInfoProps) => {
  const { data: session, status } = useSession();
  const plausible = usePlausible();
  return (
    <>
      {status === "authenticated" ? (
        <div className="w-full bg-plum p-2 text-xl text-white">
          <div className="flex items-center justify-between">
            <div
              className="cursor-pointer"
              onClick={() => {
                plausible("openInfo");
                openInfo(true);
              }}
            >
              Re:<span className="font-semibold">Tuned</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  plausible("signOut");
                  signOut();
                }}
              >
                Sign out
              </button>
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
        <div className="w-full bg-plum p-2 text-xl text-white">
          <div className="flex items-center justify-between">
            <div
              className="cursor-pointer"
              onClick={() => {
                plausible("openInfo");
                openInfo(true);
              }}
            >
              Re:<span className="font-semibold">Tuned</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
