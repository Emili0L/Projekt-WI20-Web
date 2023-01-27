import { useState } from "react";
import { BasicDialog } from "../../";
import styles from "./BasicInfo.module.scss";
import cn from "classnames";
import Icon from "@mdi/react";
import { mdiChartBoxOutline, mdiHeart, mdiHeartOutline } from "@mdi/js";
import { useMainContext } from "../../Layout/Layout";
import { DatasetModal } from "../../Modal/Dataset";

const BasicInfo = () => {
  const { selectedMarker, favorites, setFavorites } = useMainContext();
  const [isOpen, setIsOpen] = useState(false);
  const [showDatasetModal, setShowDatasetModal] = useState(false);

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
                  ? "Select a station"
                  : selectedMarker.name}
              </div>
              <div className={styles.subtitle}>
                {selectedMarker === null
                  ? "Click on the button to see dataset insights"
                  : `${displayGPS({
                      lat: selectedMarker.lat,
                      lon: selectedMarker.lon,
                    })} - ${selectedMarker.country || ""}`}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rightSide}>
          {selectedMarker !== null && (
            <div
              className={cn(styles.btnBlock, styles.hoverbg)}
              onClick={() => {
                if (selectedMarker === null || selectedMarker === undefined)
                  return;
                if (
                  selectedMarker !== null &&
                  favorites.some((fav) => fav.id === selectedMarker.id)
                ) {
                  setFavorites(
                    favorites.filter((fav) => fav.id !== selectedMarker.id)
                  );
                } else {
                  setFavorites(
                    [...favorites, selectedMarker].filter((f) => f !== null)
                  );
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
          )}
          <div
            className={cn(
              styles.btnBlock,
              styles.hoverbg,
              selectedMarker === null && styles.fullHeight
            )}
            onClick={() => {
              if (selectedMarker !== null) setIsOpen(true);
              else setShowDatasetModal(true);
            }}
          >
            <Icon
              path={mdiChartBoxOutline}
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
        maxWidth="md"
      />
      {showDatasetModal && (
        <DatasetModal
          onClose={() => {
            setShowDatasetModal(false);
          }}
          maxWidth="md"
        />
      )}
    </>
  );
};

export default BasicInfo;
