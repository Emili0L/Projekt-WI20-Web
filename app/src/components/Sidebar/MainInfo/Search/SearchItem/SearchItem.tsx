import styles from "./SearchItem.module.scss";
import type { SearchResult } from "./../../../../../interfaces";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";

type SearchItemProps = {
  result: SearchResult;
  showIcon?: boolean;
  rightDetails?: string;
};

const SearchItem = ({
  result,
  rightDetails,
  showIcon = false,
}: SearchItemProps) => {
  return (
    <div className={styles.item}>
      <div className={styles.borderContainer}>
        <div className={styles.border} />
      </div>
      <Link href={`/explore/${result._source.id}`}>
        <div className={styles.itemContainer}>
          <div className={styles.itemTitleContainer}>
            <div className={styles.title}>{result._source.id}</div>
            <div className={styles.subtitle}>{result._source.country_name}</div>
          </div>
          {result.sort && (
            <div className={styles.rightDetails}>
              {result.sort[0].toFixed(2)}km
            </div>
          )}
          {rightDetails && (
            <div className={styles.rightDetails}>{rightDetails}</div>
          )}
          {showIcon && (
            <div className={styles.itemIconContainer}>
              <div className={styles.icon}>
                <Icon path={mdiChevronRight} size={1} />
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default SearchItem;
