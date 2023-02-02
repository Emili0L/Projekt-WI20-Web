import en from "../../../../locales/en";
import de from "../../../../locales/de";
import { useRouter } from "next/router";
import { useMainContext } from "../../../Layout/Layout";
import styles from "./History.module.scss";

const History = () => {
  const router = useRouter();
  const t = router.locale === "en" ? en : de;
  const { history } = useMainContext();
  return (
    <>
      {history && history.length === 0 && (
        <div className={styles.empty}>
          <span>
            {"You have not searched yet. Start a new search in the search tab."}
          </span>
        </div>
      )}
    </>
  );
};

export default History;
