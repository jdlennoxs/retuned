import { type DefaultSession, type Account as DefaultAccount } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    error?: string;
    user?: {
      id: string;
    } & DefaultSession["user"];
  }

  interface Account extends DefaultAccount {
    expires_at: number;
  }

  interface SpotifyJWT extends JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: string;
  }
}
