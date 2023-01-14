import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Tabbar.module.scss";
import cn from "classnames";
import Icon from "@mdi/react";
import {
  mdiMap,
  mdiHeartOutline,
  mdiTune,
  mdiMagnify,
  mdiHistory,
} from "@mdi/js";
import MainInfo from "../MainInfo/Maininfo";
import { useMainContext } from "../../Layout/Layout";

const Tabbar = () => {
  const router = useRouter();
  const { setSidebarOpen } = useMainContext();

  const handleOpen = () => {
    setSidebarOpen(true);
  };

  return (
    <>
      <div className={styles.grow_container}>
        <MainInfo />
      </div>
      <div className={styles.tabbar_container}>
        <div className={styles.tabbar_c}>
          <div className={styles.tabbar_ct}></div>
        </div>
        <Link
          shallow
          href="/explore"
          className={cn(
            styles.tabbar_link,
            router.asPath.includes("/explore") && styles.tabbar_link_active
          )}
          onClick={handleOpen}
        >
          <Icon path={mdiMap} size={1} />
          <div className={styles.tabbar_link_title}>{"Explore"}</div>
        </Link>
        <Link
          shallow
          href="/favorites"
          className={cn(
            styles.tabbar_link,
            router.asPath.includes("/favorites") && styles.tabbar_link_active
          )}
          onClick={handleOpen}
        >
          <Icon path={mdiHeartOutline} size={1} />
          <div className={styles.tabbar_link_title}>{"Favorites"}</div>
        </Link>
        <Link
          shallow
          href="/history"
          className={cn(
            styles.tabbar_link,
            router.asPath.includes("/history") && styles.tabbar_link_active
          )}
          onClick={handleOpen}
        >
          <Icon path={mdiHistory} size={1} />
          <div className={styles.tabbar_link_title}>{"history"}</div>
        </Link>
        <Link
          shallow
          href="/search"
          className={cn(
            styles.tabbar_link,
            router.asPath.includes("/search") && styles.tabbar_link_active
          )}
          onClick={handleOpen}
        >
          <Icon path={mdiMagnify} size={1} />
          <div className={styles.tabbar_link_title}>{"Search"}</div>
        </Link>
        <Link
          shallow
          href="/settings"
          className={cn(
            styles.tabbar_link,
            router.asPath.includes("/settings") && styles.tabbar_link_active
          )}
          onClick={handleOpen}
        >
          <Icon path={mdiTune} size={1} />
          <div className={styles.tabbar_link_title}>{"Settings"}</div>
        </Link>
      </div>
    </>
  );
};

export default Tabbar;
