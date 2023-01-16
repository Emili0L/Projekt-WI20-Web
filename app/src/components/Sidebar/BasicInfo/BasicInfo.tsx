import { useState } from "react";
import { BasicDialog } from "../../";
import { BasicLineChart } from "../../Chart";
import styles from "./BasicInfo.module.scss";
import cn from "classnames";
import Icon from "@mdi/react";
import { mdiHeart, mdiHeartOutline, mdiOpenInNew } from "@mdi/js";
import { useMainContext } from "../../Layout/Layout";

const BasicInfo = () => {
  const { selectedMarker, favorites, setFavorites } = useMainContext();
  const [isOpen, setIsOpen] = useState(false);

  function displayGPS(gps) {
    const latitude = convertToDMS(gps.lat, "lat");
    const longitude = convertToDMS(gps.lon, "lon");
    return `${latitude} ${longitude}`;
  }

  function convertToDMS(coord, type) {
    const absolute = Math.abs(coord);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    // Adds the degree symbol
    let direction = "";
    if (type === "lat") {
      direction = coord >= 0 ? "N" : "S";
    } else {
      direction = coord >= 0 ? "E" : "W";
    }

    return `${degrees}°${minutes}'${seconds}" ${direction}`;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <div className={styles.station}>
            <div className={styles.titleContainer}>
              <div className={styles.title}>
                {selectedMarker === null
                  ? "Nearest Station Name"
                  : selectedMarker.name}
              </div>
              <div className={styles.subtitle}>
                {selectedMarker === null
                  ? "Region, Country"
                  : `${displayGPS({
                      lat: selectedMarker.lat,
                      lon: selectedMarker.lon,
                    })} - Region, Country`}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rightSide}>
          <div
            className={cn(styles.btnBlock, styles.hoverbg)}
            onClick={() => {
              // check if station is already in favorites
              // station and favorites are both objects
              // so we need to check if the id is already in the favorites array
              if (
                selectedMarker !== null &&
                favorites.some((fav) => fav.id === selectedMarker.id)
              ) {
                // remove station from favorites
                setFavorites(
                  favorites.filter((fav) => fav.id !== selectedMarker.id)
                );
              } else {
                // add station to favorites
                setFavorites([...favorites, selectedMarker]);
              }
            }}
          >
            <Icon
              path={
                selectedMarker !== null &&
                favorites.some((fav) => fav.id === selectedMarker.id)
                  ? mdiHeart
                  : mdiHeartOutline
              }
              size={1}
              color={
                selectedMarker !== null &&
                favorites.some((fav) => fav.id === selectedMarker.id)
                  ? "var(--color-primary)"
                  : "var(--color-map-foreground)"
              }
            />
            <div className={styles.cH}>
              <div className={styles.b} />
            </div>
          </div>
          <div
            className={cn(styles.btnBlock, styles.hoverbg)}
            onClick={() => {
              if (selectedMarker !== null) setIsOpen(true);
            }}
          >
            <Icon
              path={mdiOpenInNew}
              size={1}
              color="var(--color-map-foreground)"
            />
          </div>
          <div className={styles.cH}>
            <div className={styles.l} />
          </div>
        </div>
      </div>
      <BasicDialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        title="Graphen"
        maxWidth="md"
      >
        <div className="h-full w-full">
          <BasicLineChart />
        </div>
      </BasicDialog>
    </>
  );
};

export default BasicInfo;
