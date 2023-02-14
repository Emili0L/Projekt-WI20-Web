import cn from "classnames";
import { useRouter } from "next/router";
import styles from "./MainInfo.module.scss";
import { motion as m } from "framer-motion";
import { useMainContext } from "../../Layout/Layout";
import { useState } from "react";
import FavoriteItem from "./Favorites/FavoriteItem";
import Settings from "./Settings/Settings";
import Icon from "@mdi/react";
import { mdiChevronLeft } from "@mdi/js";
import Search from "./Search/Search";
import en from "../../../locales/en";
import de from "../../../locales/de";
import History from "./History";

const MainInfo = () => {
  const router = useRouter();
  const t = router.locale === "en" ? en : de;
  const { pathArray: queryPaths } = router.query;
  var pathArray = queryPaths as string[];

  const {
    setSidebarOpen,
    sidebarOpen,
    favorites,
    setFavorites,
    searchResults,
    setSearchResults,
    setLat,
    setLon,
    lat,
    lon,
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
    history: historyItems,
  } = useMainContext();

  const [isFavoriteEditMode, setIsFavoriteEditMode] = useState(false);
  const [isHistoryEditMode, setIsHistoryEditMode] = useState(false);

  const handleOpen = () => {
    if (pathArray && pathArray.includes("explore")) return;
    setSidebarOpen(!sidebarOpen);
  };

  const animation = {
    duration: 0.5,
  };

  const wrapperOpenVariants = {
    open: {
      opacity: 7.66667,
      y: "0px",
      transition: animation,
    },
    closed: {
      opacity: 1,
      y: "514px",
      transition: animation,
    },
  };

  const headerBackgroundVariants = {
    closed: {
      y: "0px",
      transition: animation,
    },
    open: {
      y: "-32px",
      transition: animation,
    },
  };

  const handleVariants = {
    closed: {
      opacity: 1,
      transition: animation,
    },
    open: {
      opacity: 0.4,
      transition: animation,
    },
  };

  const headerCTAVariants = {
    closed: {
      opacity: 0,
      y: "-10000px",
      transition: animation,
    },
    open: {
      opacity: 1,
      y: "0px",
      transition: animation,
    },
  };

  const actionVariants = {
    closed: {
      opacity: 0,
      transition: animation,
    },
    open: {
      opacity: 1,
      transition: animation,
    },
  };

  return (
    <>
      <m.div
        className={styles.wrapper}
        variants={wrapperOpenVariants}
        animate={sidebarOpen ? "open" : "closed"}
        initial="closed"
      >
        <m.div
          className={styles.headerBackgroundContainer}
          variants={headerBackgroundVariants}
          animate={sidebarOpen ? "open" : "closed"}
          initial="closed"
          onClick={handleOpen}
        >
          <div className={styles.headerBackground}></div>
          <m.div
            variants={handleVariants}
            animate={sidebarOpen ? "open" : "closed"}
            initial="closed"
            className={styles.handle}
          ></m.div>
        </m.div>
        <div className={styles.xxC}>
          <div
            className={cn(
              styles.container,
              styles.animateContainer,
              sidebarOpen && styles.container_open
            )}
            style={{
              filter: "brightness(1)",
            }}
          >
            <div className={styles.header}>
              <m.div
                variants={headerCTAVariants}
                animate={sidebarOpen ? "open" : "closed"}
                initial="closed"
                className={styles.header_cta}
              >
                {pathArray &&
                  (pathArray.includes("settings") ||
                    pathArray.includes("search")) &&
                  pathArray.length > 1 && (
                    <div
                      className={styles.header_cta_container}
                      onClick={() => {
                        router.back();
                      }}
                    >
                      <div className={styles.btn}>
                        <Icon
                          path={mdiChevronLeft}
                          size={1}
                          className={styles.btn_icon}
                        />
                        <div className={styles.btn_text}>
                          {pathArray.includes("settings") && t.tabbar.settings}
                          {pathArray.includes("search") && t.tabbar.search}
                        </div>
                      </div>
                    </div>
                  )}
              </m.div>
              <div className={styles.header_container}>
                <div className={styles.header_titleContainer}>
                  <div className={styles.header_titleContainer_title}>
                    {pathArray &&
                      pathArray.includes("favorites") &&
                      t.tabbar.favorites}
                    {pathArray &&
                      pathArray.includes("history") &&
                      t.tabbar.history}
                    {pathArray &&
                      pathArray.includes("search") &&
                      pathArray.length === 1 &&
                      t.tabbar.search}
                    {pathArray &&
                      pathArray.includes("settings") &&
                      pathArray.length === 1 &&
                      t.tabbar.settings}
                    {pathArray &&
                      pathArray.includes("settings") &&
                      pathArray.length > 1 &&
                      pathArray[pathArray.length - 1].charAt(0).toUpperCase() +
                        pathArray[pathArray.length - 1]
                          .slice(1)
                          .replace(/-/g, " ")}
                    {pathArray &&
                      pathArray.includes("search") &&
                      pathArray.length > 1 &&
                      pathArray[pathArray.length - 1].charAt(0).toUpperCase() +
                        pathArray[pathArray.length - 1]
                          .slice(1)
                          .replace(/-/g, " ")}
                  </div>
                </div>
                <div className={styles.header_extrasContainer}>
                  {pathArray &&
                    pathArray.includes("favorites") &&
                    favorites.length > 0 && (
                      <>
                        <m.div
                          variants={actionVariants}
                          animate={sidebarOpen ? "open" : "closed"}
                          initial="closed"
                          className={styles.action}
                          onClick={() =>
                            setIsFavoriteEditMode(!isFavoriteEditMode)
                          }
                        >
                          <div className={styles.action_text}>
                            {isFavoriteEditMode ? t.done : t.edit}
                          </div>
                        </m.div>
                      </>
                    )}
                  {pathArray &&
                    pathArray.includes("history") &&
                    historyItems.length > 0 && (
                      <>
                        <m.div
                          variants={actionVariants}
                          animate={sidebarOpen ? "open" : "closed"}
                          initial="closed"
                          className={styles.action}
                          onClick={() =>
                            setIsHistoryEditMode(!isHistoryEditMode)
                          }
                        >
                          <div className={styles.action_text}>
                            {isHistoryEditMode ? t.done : t.edit}
                          </div>
                        </m.div>
                      </>
                    )}
                  {pathArray &&
                    pathArray.includes("search") &&
                    pathArray.length === 1 &&
                    (searchResults !== null ||
                      distance !== 200 ||
                      maxResults !== 20 ||
                      startYear !== 1750 ||
                      endYear !== 2023 ||
                      lat !== "" ||
                      lon !== "" ||
                      countryCode !== "") && (
                      <>
                        <m.div
                          variants={actionVariants}
                          animate={sidebarOpen ? "open" : "closed"}
                          initial="closed"
                          className={styles.action}
                          onClick={() => {
                            setLat("");
                            setLon("");
                            setSearchResults(null);
                            setDistance(200);
                            setMaxResults(20);
                            setStartYear(1750);
                            setEndYear(2023);
                            setCountryCode("");
                          }}
                        >
                          <div className={styles.action_text}>{t.reset}</div>
                        </m.div>
                      </>
                    )}
                </div>
              </div>
            </div>
            <div className={cn(styles.content, "content")}>
              {pathArray && pathArray.includes("favorites") && (
                <>
                  {/* No favorites yet */}
                  {favorites.length === 0 && (
                    <div className={styles.noFavoritesContainer}>
                      <span>
                        {t.favorite.your}{" "}
                        <svg
                          className={styles.noFavoritesContainer_icon}
                          width="32"
                          height="32"
                        >
                          <path d="M11.198 9C8.85 9 7 10.89 7 13.29c0 3.128 1.92 5.82 9 11.71 7.08-5.89 9-8.582 9-11.71C25 10.89 23.15 9 20.802 9c-2.098 0-3.237 1.273-4.126 2.327l-.676.8-.676-.8C14.434 10.31 13.296 9 11.197 9h0z"></path>
                        </svg>{" "}
                        {t.favorite.appear}
                      </span>
                    </div>
                  )}
                  {/* Favorites */}
                  {favorites.length > 0 && (
                    <div className="favorite-list">
                      {favorites.map(
                        (favorite) =>
                          favorite !== null && (
                            <FavoriteItem
                              key={favorite.id}
                              favorite={favorite}
                              isEditMode={isFavoriteEditMode}
                              onRemove={() => {
                                setFavorites(
                                  favorites
                                    .filter((f) => f.id !== favorite.id)
                                    .filter((f) => f !== null)
                                );
                              }}
                              onClick={() => {
                                router.push(
                                  `/explore/${favorite.id}`,
                                  undefined,
                                  { shallow: true }
                                );
                              }}
                            />
                          )
                      )}
                    </div>
                  )}
                </>
              )}
              {pathArray && pathArray.includes("history") && (
                <History isEditMode={isHistoryEditMode} />
              )}
              {pathArray && pathArray.includes("search") && <Search />}
              {pathArray && pathArray.includes("settings") && <Settings />}
            </div>
          </div>
        </div>
      </m.div>
    </>
  );
};

export default MainInfo;
