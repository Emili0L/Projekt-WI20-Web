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

  type GeoPoint = {
    type: "Feature";
    geometry: {
      type: "Point";
      coordinates: [number, number];
    };
    properties: {
      id: string;
      name: string;
    };
  };

  type MarkerMetaData = {
    id: string;
    name: string;
    region?: string;
    country?: string;
    lat: number;
    lon: number;
  };

  type Favorite = MarkerMetaData;

  type Doc = {
    id: string;
    elevation: number;
    country_code: string;
    country_name: string;
    coordinates: [number, number];
  };

  type CountrySuggestion = {
    key: string;
    doc_count: number;
    top_country_hits: {
      hits: {
        total: {
          value: number;
          relation: string;
        };
        max_score: number;
        hits: [
          {
            _index: string;
            _id: string;
            _score: number;
            _source: Doc;
          }
        ];
      };
    };
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
