import { router } from "../trpc";
import { authRouter } from "./auth";
import { spotifyRouter } from "./spotify";

export const appRouter = router({
  spotify: spotifyRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
