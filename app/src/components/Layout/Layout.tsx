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
import Crosshair from "../Crosshair/Crosshair";

type Props = {
  title?: string;
  children?: ReactNode;
};

type LayoutContext = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const LayoutContext = createContext<LayoutContext>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
});

export const useLayoutContext = () => useContext(LayoutContext);

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

  useEffect(() => {
    if (
      initialLoad &&
      (router.asPath.includes("/search") ||
        router.asPath.includes("/browse") ||
        router.asPath.includes("/history") ||
        router.asPath.includes("/explore") ||
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
            <LayoutContext.Provider
              value={{
                sidebarOpen,
                setSidebarOpen,
              }}
            >
              <Sidebar />
              <Crosshair />

              {children}
            </LayoutContext.Provider>
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
