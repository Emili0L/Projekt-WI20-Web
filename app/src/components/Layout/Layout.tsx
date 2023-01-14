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

type Props = {
  title?: string;
  children?: ReactNode;
};

type MainContext = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedMarkerId?: string;
  setSelectedMarkerId?: (id: string) => void;
};

const MainContext = createContext<MainContext>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
  selectedMarkerId: null,
  setSelectedMarkerId: () => {},
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

  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

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
                selectedMarkerId,
                setSelectedMarkerId,
              }}
            >
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
