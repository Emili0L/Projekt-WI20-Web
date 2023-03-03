import { ReactElement } from "react";
import { NextPage } from "next";
import { DefaultSession } from "next-auth";
import { SearchResult } from "./interfaces";

declare global {
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
    name: string;
    elevation: number;
    coordinates: [number, number];
    country_code: string;
    country_name: string;
    years: number[];
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

  // based on the type of history item the query is either a text or a coordinates query
  type SearchQuery = string | [number, number];

  type HistoryItem = {
    type: "text" | "coordinates";
    query: SearchQuery;
    country: string | null;
    distance?: number;
    maxResults: number;
    startYear: number;
    endYear: number;
    nrReturnedResults?: number;
    timestamp: number;
    results: SearchResult[];
  };
}

export {};
