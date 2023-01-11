import { ReactNode, FC, useState, useEffect } from "react";
import Head from "next/head";
import Header from "./Header";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import cn from "classnames";
import styles from "./Layout.module.scss";

type Props = {
  title?: string;
  children?: ReactNode;
};

const environment = () => {
  if (typeof window == "undefined") return null;
  const isStaging = window?.location.hostname.match(/stg/g)?.length;
  const isLocal = window?.location.hostname.match(/localhost/g)?.length;

  return isStaging ? "Staging" : isLocal ? "Localhost" : null;
};

const Layout: FC<Props> = ({ children, title }) => {
  const env = environment();
  const suffix = env ? ` - ${env}` : "";

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth > 1024) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
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

        <Header
          title={title}
          isOpen={sidebarOpen}
          menuToggle={() => {
            setSidebarOpen(!sidebarOpen);
          }}
        />
        <div className="flex h-full relative overflow-hidden z-0">
          <main className={cn("dark:bg-grey app__main", styles.app__main)}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
