import { ReactElement } from "react";
import { NextPage } from "next";
import { DefaultSession } from "next-auth";

declare global {
  // declare ts types here
  type ExtendedNextPage<P = {}> = NextPage<P> & {
    layout?: any;
    auth?: {
      enabled: boolean;
    };
  };

  type Favorite = {
    id: string;
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
  };
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      // your cutom props
    } & DefaultSession["user"];
  }
}

export {};
