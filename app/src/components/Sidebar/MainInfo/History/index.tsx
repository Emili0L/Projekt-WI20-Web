import en from "../../../../locales/en";
import de from "../../../../locales/de";
import { useRouter } from "next/router";
import { useMainContext } from "../../../Layout/Layout";
import styles from "./History.module.scss";
import HistoryItem from "./HistoryItem";

type Props = {
  isEditMode?: boolean;
};

const History = ({ isEditMode }: Props) => {
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
      {history && history.length > 0 && (
        <div className={styles.history}>
          {history
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((item) => (
              <HistoryItem
                key={item.timestamp}
                item={item}
                isEditMode={isEditMode}
              />
            ))}
        </div>
      )}
    </>
  );
};

export default History;
