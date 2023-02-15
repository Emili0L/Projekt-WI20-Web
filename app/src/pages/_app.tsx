import type { AppProps } from "next/app";
import MainLayout from "../components/Layout";
import SwrProvider from "../providers/SwrProvider";
import { ThemeProvider } from "next-themes";

import "../styles/index.css";
import "../styles/map.scss";
import "leaflet/dist/leaflet.css";
import MuiThemeProvider from "../providers/MuiThemeProvider";

type AppLayoutProps = AppProps & {
  Component: ExtendedNextPage;
  pageProps: any;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppLayoutProps) => {
  const Layout = Component.layout ?? ((page: any) => <>{page.children}</>);

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
