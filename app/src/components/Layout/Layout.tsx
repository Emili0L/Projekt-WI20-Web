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
import useSWRImmutable from "swr/immutable";

type Props = {
  title?: string;
  children?: ReactNode;
};

type MainContext = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  map: any;
  setMap: (map: any) => void;
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
  startYear?: number;
  setStartYear?: (startYear: number) => void;
  endYear?: number;
  setEndYear?: (endYear: number) => void;
  countryCode?: string;
  setCountryCode?: (countryCode: string) => void;
  favorites?: Favorite[];
  setFavorites?: (
    value: Favorite[] | ((val: Favorite[]) => Favorite[])
  ) => void;
  suggestionStations?: CountrySuggestion[];
  setSuggestionStations?: (stations: CountrySuggestion[]) => void;
  history?: HistoryItem[];
  setHistory?: (
    value: HistoryItem[] | ((val: HistoryItem[]) => HistoryItem[])
  ) => void;
};

const MainContext = createContext<MainContext>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
  map: null,
  setMap: () => {},
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
  startYear: 1750,
  setStartYear: () => {},
  endYear: 2023,
  setEndYear: () => {},
  countryCode: "",
  setCountryCode: () => {},
  searchResults: [],
  setSearchResults: () => {},
  favorites: [],
  setFavorites: () => {},
  suggestionStations: [],
  setSuggestionStations: () => {},
  history: [],
  setHistory: () => {},
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

  const [map, setMap] = useState<any>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerMetaData>(null);

  const [favorites, setFavorites] = useLocalStorage<Favorite[]>(
    "favorites",
    []
  );
  const [searchHistory, setSearchHistory] = useLocalStorage<HistoryItem[]>(
    "searchHistory",
    []
  );

  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
  const [distance, setDistance] = useState<number>(200);
  const [maxResults, setMaxResults] = useState<number>(20);
  const [startYear, setStartYear] = useState<number>(1750);
  const [endYear, setEndYear] = useState<number>(2023);
  const [countryCode, setCountryCode] = useState<string>("");
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

  useSWRImmutable("/api/suggestion/country", {
    onSuccess: (data) => setSuggestionStations(data),
  });

  useEffect(() => {
    // if the path matches /expore/:id and no marker is selected or a change has been detected, fecth and set the marker
    if (
      router.asPath.includes("/explore") &&
      router.asPath.includes("/explore/")
    ) {
      const id = router.asPath.split("/explore/")[1];
      if (!selectedMarker || (selectedMarker && selectedMarker.id !== id)) {
        fetch(`/api/station/${id}/info`)
          .then((res) => res.json())
          .then((data) => {
            setSelectedMarker({
              id: data.id,
              name: data.name,
              country: data.country_name,
              lat: data.coordinates[0],
              lon: data.coordinates[1],
            });
            if (map) {
              map.flyTo([data.coordinates[1], data.coordinates[0]], 9);
            }
          })
          .catch((err) => console.log(err));
      }
    }
  }, [router.asPath]);

  return (
    <>
      <noscript>
        Please{" "}
        <a href="https://www.enable-javascript.com" rel="nofollow">
          enable JavaScript
        </a>
        <br />
        in order to view this website.
      </noscript>
      <LoadingIndicator />
      <div className="flex h-screen flex-col">
        <Head>
          <title>{`${title}${suffix}`}</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta name="description" content="GHCND Station Explorer" />
          <meta name="author" content="Sven Huepers" />
          <meta
            name="keywords"
            content="GHCND, Station, Explorer, Weather, Temperature, Climate"
          />
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow" />
          <meta name="google" content="notranslate" />

          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          <meta
            name="apple-mobile-web-app-title"
            content="GHCND Station Explorer"
          />

          <meta property="og:type" content="website" />
          <meta property="og:title" content="GHCND Station Explorer" />
          <meta
            property="og:description"
            content="Explore GHCND weather stations"
          />
        </Head>
        <div className="flex h-full relative overflow-hidden z-0">
          <main className={cn("dark:bg-grey app__main", styles.app__main)}>
            <MainContext.Provider
              value={{
                sidebarOpen,
                setSidebarOpen,
                map,
                setMap,
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
                startYear,
                setStartYear,
                endYear,
                setEndYear,
                countryCode,
                setCountryCode,
                searchResults,
                setSearchResults,
                favorites,
                setFavorites,
                suggestionStations,
                setSuggestionStations,
                history: searchHistory,
                setHistory: setSearchHistory,
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
