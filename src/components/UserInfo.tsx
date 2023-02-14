import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const UserInfo = () => {
  const { data: session } = useSession();
  return (
    <div className="fixed top-0 w-full  text-white">
      <div className="flex items-center justify-between">
        <div className="p-2 text-xl">
          Re:<span className="font-semibold">Tuned</span>
        </div>
        <div className="flex gap-2 p-2">
          <button onClick={() => signOut()}>Sign out</button>
          <Image
            src={session?.user?.image || ""}
            width={36}
            height={36}
            alt=""
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
