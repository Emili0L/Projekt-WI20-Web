import cn from "classnames";
import { useRouter } from "next/router";
import styles from "./Maininfo.module.scss";
import { motion as m } from "framer-motion";
import { useLayoutContext } from "../../Layout/Layout";
import { useState } from "react";
import FavoriteItem from "./Favorites/FavoriteItem";

const MainInfo = () => {
  const router = useRouter();
  const { pathArray: queryPaths } = router.query;
  var pathArray = queryPaths as string[];

  const { setSidebarOpen, sidebarOpen } = useLayoutContext();

  const [isFavoriteEditMode, setIsFavoriteEditMode] = useState(false);

  const handleOpen = () => {
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

  const dummyFavorites = [
    {
      id: "1",
      name: "Station 1",
      region: "Region 1",
      country: "Country 1",
      lat: 1,
      lon: 1,
    },
  ] as Favorite[];

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
            ></m.div>
            <div className={styles.header_container}>
              {pathArray.includes("explore") && (
                <div className={styles.header_count}>
                  <div className={styles.header_count_count}>
                    <div
                      className={cn(
                        styles.header_count_count_number,
                        styles.singleDigit
                      )}
                    >
                      {"1"}
                    </div>
                  </div>
                </div>
              )}
              <div className={styles.header_titleContainer}>
                <div className={styles.header_titleContainer_title}>
                  {pathArray.includes("explore") && "Current Region"}
                  {pathArray.includes("favorites") && "Favorites"}
                  {pathArray.includes("history") && "History"}
                  {pathArray.includes("search") && "Search"}
                  {pathArray.includes("settings") && "Settings"}
                </div>
                <div className={styles.header_titleContainer_subtitleContainer}>
                  <div className={styles.header_titleContainer_subtitle}>
                    {router.asPath.includes("/explore") && "Country"}
                  </div>
                </div>
              </div>
              <div className={styles.header_extrasContainer}>
                {pathArray.includes("favorites") &&
                  dummyFavorites.length > 0 && (
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
                          {isFavoriteEditMode ? "Done" : "Edit"}
                        </div>
                      </m.div>
                    </>
                  )}
              </div>
            </div>
          </div>
          <div className={cn(styles.content, "content")}>
            {pathArray.includes("explore") && (
              <>
                <div>Explore</div>
              </>
            )}
            {pathArray.includes("favorites") && (
              <>
                {/* No favorites yet */}
                {dummyFavorites.length === 0 && (
                  <div className={styles.noFavoritesContainer}>
                    <span>
                      Your{" "}
                      <svg
                        className={styles.noFavoritesContainer_icon}
                        width="32"
                        height="32"
                      >
                        <path d="M11.198 9C8.85 9 7 10.89 7 13.29c0 3.128 1.92 5.82 9 11.71 7.08-5.89 9-8.582 9-11.71C25 10.89 23.15 9 20.802 9c-2.098 0-3.237 1.273-4.126 2.327l-.676.8-.676-.8C14.434 10.31 13.296 9 11.197 9h0z"></path>
                      </svg>{" "}
                      stations will appear&nbsp;here.
                    </span>
                  </div>
                )}
                {/* Favorites */}
                {dummyFavorites.length > 0 && (
                  <div className="favorite-list">
                    {dummyFavorites.map((favorite) => (
                      <FavoriteItem
                        key={favorite.id}
                        favorite={favorite}
                        isEditMode={isFavoriteEditMode}
                        onRemove={() => {
                          console.log("remove");
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
            {pathArray.includes("history") && (
              <>
                <div>History</div>
              </>
            )}
            {pathArray.includes("search") && (
              <>
                <div>Search</div>
              </>
            )}
            {pathArray.includes("settings") && (
              <>
                <div>Settings</div>
              </>
            )}
          </div>
        </div>
      </m.div>
    </>
  );
};

export default MainInfo;
