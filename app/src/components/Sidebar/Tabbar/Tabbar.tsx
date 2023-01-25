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
import en from "../../../locales/en";
import de from "../../../locales/de";

const Tabbar = () => {
  const router = useRouter();
  const t = router.locale === "en" ? en : de;
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
          key="explore"
        >
          <Icon path={mdiMap} size={1} />
          <div className={styles.tabbar_link_title}>{t.tabbar.explore}</div>
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
          <div className={styles.tabbar_link_title}>{t.tabbar.favorites}</div>
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
          <div className={styles.tabbar_link_title}>{t.tabbar.history}</div>
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
          <div className={styles.tabbar_link_title}>{t.tabbar.search}</div>
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
          <div className={styles.tabbar_link_title}>{t.tabbar.settings}</div>
        </Link>
      </div>
    </>
  );
};

export default Tabbar;
