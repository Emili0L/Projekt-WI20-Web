import Ad from "./Ads";
import BasicInfo from "./BasicInfo/BasicInfo";
import styles from "./Sidebar.module.scss";
import Tabbar from "./Tabbar/Tabbar";

const Sidebar = () => {
  return (
    <>
      <aside className={styles.container_desktop}>
        <BasicInfo />
        <Tabbar />
      </aside>
      <Ad />
    </>
  );
};

export default Sidebar;
