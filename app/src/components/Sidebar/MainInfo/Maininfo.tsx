import cn from "classnames";
import { useRouter } from "next/router";
import styles from "./Maininfo.module.scss";
import { motion as m } from "framer-motion";
import { useLayoutContext } from "../../Layout/Layout";

const MainInfo = () => {
  const router = useRouter();
  const { pathArray: queryPaths } = router.query;
  var pathArray = queryPaths as string[];

  const { setSidebarOpen, sidebarOpen } = useLayoutContext();

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
              <div className={styles.header_titleContainer}>
                <div className={styles.header_titleContainer_title}>
                  {"Current Region"}
                </div>
                <div className={styles.header_titleContainer_subtitleContainer}>
                  <div className={styles.header_titleContainer_subtitle}>
                    {"Country"}
                  </div>
                </div>
              </div>
              <div className={styles.header_extrasContainer}></div>
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
                <div>Favorites</div>
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
