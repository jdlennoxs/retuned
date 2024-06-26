import NextAuth, {
  type NextAuthOptions,
  type SpotifyJWT,
  type Account,
} from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { spotifyApi } from "../../../server/common/spotify-client";

import { env } from "../../../env/server.mjs";

const scopes = [
  "user-top-read",
  "user-library-read",
  "user-read-recently-played",
  "playlist-modify-public",
].join(",");

const params = {
  scope: scopes,
};

const queryParamString = new URLSearchParams(params);

async function refreshAccessToken(token: SpotifyJWT) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);
    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken?.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async jwt({ token, user, account }) {
      const spotifyToken = token as SpotifyJWT;
      const spotifyAccount = account as Account;
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: spotifyAccount.access_token,
          accessTokenExpires: spotifyAccount.expires_at * 1000,
          refreshToken: spotifyAccount.refresh_token,
          user,
        };
      }
      // Return previous token if the access token has not expired yet
      if (Date.now() < spotifyToken.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(<SpotifyJWT>token);
    },
    async session({ session, token }) {
      const spotifyToken = token as SpotifyJWT;
      session.accessToken = spotifyToken.accessToken;
      session.refreshToken = spotifyToken.refreshToken;
      session.error = spotifyToken.error;

      return session;
    },
  },
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      authorization: `https://accounts.spotify.com/authorize?${queryParamString.toString()}`,
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
