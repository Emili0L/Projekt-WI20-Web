import { memo } from "react";
import styles from "./FavoriteItem.module.scss";
import cn from "classnames";
import { mdiChevronRight, mdiHeart } from "@mdi/js";
import Icon from "@mdi/react";

type Props = {
  favorite: Favorite;
  onRemove: (favorite: Favorite) => void;
  isEditMode: boolean;
  onClick?: () => void;
};

const FavoriteItem = memo(
  ({ favorite, onRemove, isEditMode, onClick }: Props) => {
    return (
      <>
        <div className={styles.item}>
          <div className={styles.borderContainer}>
            <div className={styles.border} />
          </div>
          {isEditMode && (
            <div
              className={styles.deleteContainer}
              onClick={() => onRemove(favorite)}
            >
              <Icon path={mdiHeart} size={1} color="var(--color-primary)" />
            </div>
          )}
          <div
            className={cn(styles.itemContainer, isEditMode && styles.itemEdit)}
            onClick={onClick}
          >
            <div className={styles.titleContainer}>
              <div className={styles.title}>{favorite.name}</div>
              <div className={styles.subtitle}>
                {`${favorite.id} - ${favorite.country}`}
              </div>
            </div>
            <div className={styles.itemIconContainer}>
              <div className={styles.icon}>
                <Icon path={mdiChevronRight} size={1} />
              </div>
            </div>
          </div>
          {/* <div
            className={cn(
              styles.rowBtnContainer,
              isEditMode && styles.hasLeftAccessory
            )}
          >
            <div className={styles.titleContainer}>
              <div className={styles.title}>{favorite.name}</div>
              <div className={styles.subtitle}>{favorite.region}</div>
            </div>
          </div> */}
        </div>
      </>
    );
  }
);

FavoriteItem.displayName = "FavoriteItem";

export default FavoriteItem;
