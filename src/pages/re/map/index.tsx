import FeatureMap from "@/components/FeatureMap";
import Search from "@/components/Search";
import useMapperStore from "@/utils/useMapperStore";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Map() {
  const { status } = useSession();
  const step = useMapperStore((state) => state.step);
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [status]);

  if (step === "Start") {
    return <div className="mx-auto mt-8 flex w-full sm:w-96 justify-between px-4">
      <Search />
    </div>
  }
  return (
    <FeatureMap />
  );
}
