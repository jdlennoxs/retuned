import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const UserInfo = () => {
  const { data: session } = useSession();
  return (
    <div className="fixed top-0 w-full  text-white">
      <div className="flex items-center justify-end gap-2 p-2">
        <div className="flex flex-col">
          <button onClick={() => signOut()}>Sign out</button>
        </div>
        <Image
          src={session?.user?.image || ""}
          width={36}
          height={36}
          alt=""
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default UserInfo;
