import {
  ReactNode,
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
} from "react";
import Head from "next/head";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import cn from "classnames";
import styles from "./Layout.module.scss";
import Sidebar from "../Sidebar";
import { useRouter } from "next/router";
import { Map } from "..";
import { SearchResult } from "../../interfaces";
import { useLocalStorage } from "../../hooks";

type Props = {
  title?: string;
  children?: ReactNode;
};

type MainContext = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedMarker?: MarkerMetaData;
  setSelectedMarker?: (marker: MarkerMetaData) => void;
  searchResults?: SearchResult[];
  setSearchResults?: (results: SearchResult[]) => void;
  lat?: string;
  setLat?: (lat: string) => void;
  lon?: string;
  setLon?: (lon: string) => void;
  distance?: number;
  setDistance?: (distance: number) => void;
  maxResults?: number;
  setMaxResults?: (maxResults: number) => void;
  favorites?: Favorite[];
  setFavorites?: (favorites: Favorite[]) => void;
  suggestionStations?: CountrySuggestion[];
  setSuggestionStations?: (stations: CountrySuggestion[]) => void;
};

const MainContext = createContext<MainContext>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
  selectedMarker: null,
  setSelectedMarker: () => {},
  lat: null,
  setLat: () => {},
  lon: null,
  setLon: () => {},
  distance: 200,
  setDistance: () => {},
  maxResults: 20,
  setMaxResults: () => {},
  searchResults: [],
  setSearchResults: () => {},
  favorites: [],
  setFavorites: () => {},
  suggestionStations: [],
  setSuggestionStations: () => {},
});

export const useMainContext = () => useContext(MainContext);

const environment = () => {
  if (typeof window == "undefined") return null;
  const isStaging = window?.location.hostname.match(/stg/g)?.length;
  const isLocal = window?.location.hostname.match(/localhost/g)?.length;

  return isStaging ? "Staging" : isLocal ? "Localhost" : null;
};

const Layout: FC<Props> = ({ children, title }) => {
  const env = environment();
  const suffix = env ? ` - ${env}` : "";
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const [selectedMarker, setSelectedMarker] = useState<MarkerMetaData>(null);

  const [favorites, setFavorites] = useLocalStorage("favorites", []);

  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
  const [distance, setDistance] = useState<number>(200);
  const [maxResults, setMaxResults] = useState<number>(20);
  const [searchResults, setSearchResults] = useState<SearchResult[]>();
  const [suggestionStations, setSuggestionStations] = useState<
    CountrySuggestion[]
  >([]);

  useEffect(() => {
    if (
      initialLoad &&
      router.asPath &&
      (router.asPath.includes("/search") ||
        router.asPath.includes("/browse") ||
        router.asPath.includes("/history") ||
        router.asPath.includes("/favorites") ||
        router.asPath.includes("/settings"))
    ) {
      setSidebarOpen(true);
      setInitialLoad(false);
    }
  }, [sidebarOpen]);

  useEffect(() => {
    if (router.asPath.includes("/explore")) {
      setSidebarOpen(false);
    }
  }, [router.asPath]);

  useEffect(() => {
    fetch("/api/suggestion/country")
      .then((res) => res.json())
      .then((data) => {
        setSuggestionStations(data);
      });
  }, []);

  return (
    <>
      <LoadingIndicator />
      <div className="flex h-screen flex-col">
        <Head>
          <title>{`${title}${suffix}`}</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>

        <div className="flex h-full relative overflow-hidden z-0">
          <main className={cn("dark:bg-grey app__main", styles.app__main)}>
            <MainContext.Provider
              value={{
                sidebarOpen,
                setSidebarOpen,
                selectedMarker,
                setSelectedMarker,
                lat,
                setLat,
                lon,
                setLon,
                distance,
                setDistance,
                maxResults,
                setMaxResults,
                searchResults,
                setSearchResults,
                favorites,
                setFavorites,
                suggestionStations,
                setSuggestionStations,
              }}
            >
              <div className="h-full relative">
                <Map />
              </div>
              <Sidebar />
              {children}
            </MainContext.Provider>
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
