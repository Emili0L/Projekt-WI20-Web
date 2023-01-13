import { memo } from "react";
import styles from "./FavoriteItem.module.scss";
import cn from "classnames";
import { mdiHeart } from "@mdi/js";
import Icon from "@mdi/react";

type Props = {
  favorite: Favorite;
  onRemove: (favorite: Favorite) => void;
  isEditMode: boolean;
};

const FavoriteItem = memo(({ favorite, onRemove, isEditMode }: Props) => {
  return (
    <>
      <div className={styles.rowContainer}>
        <div className={cn(styles.borderContainer, "b")}>
          <div className={styles.border} />
        </div>
        <div
          className={cn(
            styles.rowBtnContainer,
            isEditMode && styles.hasLeftAccessory
          )}
        >
          {isEditMode && (
            <div className={styles.remove} onClick={() => onRemove(favorite)}>
              <Icon path={mdiHeart} size={1} color="var(--color-primary)" />
            </div>
          )}
          <div className={styles.titleContainer}>
            <div className={styles.title}>{favorite.name}</div>
            <div className={styles.subtitle}>{favorite.region}</div>
          </div>
        </div>
      </div>
    </>
  );
});

FavoriteItem.displayName = "FavoriteItem";

export default FavoriteItem;
