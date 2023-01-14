import { useState } from "react";
import { BasicDialog } from "../../";
import { BasicLineChart } from "../../Chart";
import styles from "./BasicInfo.module.scss";
import cn from "classnames";
import Icon from "@mdi/react";
import { mdiHeartOutline, mdiOpenInNew } from "@mdi/js";
import { useMainContext } from "../../Layout/Layout";

const BasicInfo = () => {
  const { selectedMarkerId } = useMainContext();

  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <div className={styles.station}>
            <div className={styles.titleContainer}>
              <div className={styles.title}>
                {selectedMarkerId === null
                  ? "Nearest Station Name"
                  : selectedMarkerId}
              </div>
              <div className={styles.subtitle}>Region, Country</div>
            </div>
          </div>
        </div>
        <div className={styles.rightSide}>
          <div className={cn(styles.btnBlock, styles.hoverbg)}>
            <Icon
              path={mdiHeartOutline}
              size={1}
              color="var(--color-map-foreground)"
            />
            <div className={styles.cH}>
              <div className={styles.b} />
            </div>
          </div>
          <div
            className={cn(styles.btnBlock, styles.hoverbg)}
            onClick={() => {
              setIsOpen(true);
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
