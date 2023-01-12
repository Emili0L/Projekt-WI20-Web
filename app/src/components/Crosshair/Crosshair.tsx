import { useLayoutContext } from "../Layout/Layout";
import styles from "./Crosshair.module.scss";
import cn from "classnames";

const Crosshair = () => {
  const { sidebarOpen } = useLayoutContext();
  return (
    <>
      <div className={styles.container}>
        <div
          className={cn(
            !sidebarOpen && styles.containerCenter,
            styles.innerContainer
          )}
        >
          <svg className={styles.crosshair} viewBox="0 0 58 58">
            <circle className={styles.circle} r="28" cx="50%" cy="50%"></circle>
          </svg>
        </div>
      </div>
    </>
  );
};

export default Crosshair;
