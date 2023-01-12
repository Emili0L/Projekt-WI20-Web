import type { AppProps } from "next/app";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import MainLayout from "../components/Layout";
import SwrProvider from "../providers/SwrProvider";
import { ThemeProvider } from "next-themes";

import "../styles/index.css";
import "../styles/map.scss";
import "leaflet/dist/leaflet.css";

type AppLayoutProps = AppProps & {
  Component: ExtendedNextPage;
  pageProps: any;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppLayoutProps) => {
  const Layout = Component.layout ?? ((page: any) => <>{page.children}</>);
  const authEnabled = !Component.auth || Component.auth.enabled;

  const AuthWrapper = authEnabled
    ? (page: any) => <Auth>{page.children}</Auth>
    : (page: any) => <>{page.children}</>;

  return (
    <SessionProvider session={session}>
      {/* Uncomment to enable auth */}
      {/* <AuthWrapper> */}
      <SwrProvider>
        <ThemeProvider attribute="class" defaultTheme="system">
          <MainLayout title="WI20C - Projekt">
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MainLayout>
        </ThemeProvider>
      </SwrProvider>
      {/* </AuthWrapper> */}
    </SessionProvider>
  );
};

const Auth: React.FC<{ children: any }> = ({ children }) => {
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => signIn(),
  });

  if (status === "loading") return null;
  return children;
};

export default MyApp;
