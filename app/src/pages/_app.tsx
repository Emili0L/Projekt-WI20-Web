import type { AppProps } from "next/app";
import MainLayout from "../components/Layout";
import SwrProvider from "../providers/SwrProvider";
import { ThemeProvider } from "next-themes";

import "../styles/index.css";
import "../styles/map.scss";
import "leaflet/dist/leaflet.css";
import MuiThemeProvider from "../providers/MuiThemeProvider";
import { useEffect } from "react";

type AppLayoutProps = AppProps & {
  Component: ExtendedNextPage;
  pageProps: any;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppLayoutProps) => {
  const Layout = Component.layout ?? ((page: any) => <>{page.children}</>);

  useEffect(() => {
    var userAgent = window.navigator.userAgent;

    // create a use Effect function to set the vh variable
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    // add the event listener
    window.addEventListener("resize", setVh);
    // call the function to set the variable for the first time
    setVh();
    // remove the event listener on cleanup
    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <SwrProvider>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <MuiThemeProvider>
          <MainLayout title="WI20C - Projekt">
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MainLayout>
        </MuiThemeProvider>
      </ThemeProvider>
    </SwrProvider>
  );
};

export default MyApp;
