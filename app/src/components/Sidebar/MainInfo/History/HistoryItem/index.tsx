import en from "../../../../../locales/en";
import de from "../../../../../locales/de";
import { useRouter } from "next/router";
import styles from "./HistoryItem.module.scss";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiChevronRight, mdiTrashCanOutline } from "@mdi/js";
import { useMainContext } from "../../../../Layout/Layout";

type HistoryItemProps = {
  item: HistoryItem;
  isEditMode?: boolean;
};

const HistoryItem = ({ item, isEditMode }: HistoryItemProps) => {
  const router = useRouter();
  const t = router.locale === "en" ? en : de;
  const {
    setHistory,
    setSearchResults,
    setLat,
    setLon,
    setStartYear,
    setEndYear,
    setDistance,
    setCountryCode,
    setMaxResults,
  } = useMainContext();

  const handleItemClick = () => {
    if (isEditMode) return;
    if (item.type === "coordinates") {
      setSearchResults(item.results);
      setLat(item.query[0].toString());
      setLon(item.query[1].toString());
      setStartYear(item.startYear);
      setEndYear(item.endYear);
      setDistance(item.distance);
      setMaxResults(item.maxResults);
      if (item.country && item.country !== "") setCountryCode(item.country);

      router.push({
        pathname: "/search",
        query: {
          lat: item.query[0],
          lng: item.query[1],
          distance: item.distance,
          size: item.maxResults,
          start_year: item.startYear,
          end_year: item.endYear,
          ...(item.country &&
            item.country !== "" && {
              country: item.country,
            }),
        },
      });
    }
  };

  const handleItemDelete = () => {
    setHistory((prev) => {
      const newHistory = prev.filter((i) => i !== item);
      return newHistory;
    });
  };

  return (
    <>
      <div className={styles.item}>
        <div className={styles.borderContainer}>
          <div className={styles.border} />
        </div>
        {isEditMode && (
          <div className={styles.deleteContainer} onClick={handleItemDelete}>
            <Icon path={mdiTrashCanOutline} size={1} />
          </div>
        )}
        {item && item.type === "coordinates" && (
          <>
            <div className={styles.itemContainer} onClick={handleItemClick}>
              <div className={styles.countContainer}>
                <div className={styles.content}>
                  <div className={styles.circle}>
                    <div className={styles.count}>{item.nrReturnedResults}</div>
                  </div>
                </div>
              </div>
              <div className={styles.titleContainer}>
                <div
                  className={styles.title}
                >{`Lat: ${item.query[0]}, Lon: ${item.query[1]}`}</div>
                <div className={styles.subtitle}>
                  {`${item.distance} km, ${item.maxResults}x, ${item.startYear} - ${item.endYear}`}
                </div>
              </div>
              <div className={styles.itemIconContainer}>
                <div className={styles.icon}>
                  <Icon path={mdiChevronRight} size={1} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HistoryItem;
