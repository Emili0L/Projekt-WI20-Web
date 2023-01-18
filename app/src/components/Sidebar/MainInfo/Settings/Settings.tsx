import { mdiChevronRight } from "@mdi/js";
import Icon from "@mdi/react";
import { Switch } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo } from "react";
import styles from "./Settings.module.scss";

type Props = {};
type SettingsItemProps = {
  title: string;
  link?: any;
};

const SettingsItem = memo(({ title, link }: SettingsItemProps) => {
  return (
    <div className={styles.item}>
      <div className={styles.borderContainer}>
        <div className={styles.border} />
      </div>
      <Link href={link}>
        <div className={styles.itemContainer}>
          <div className={styles.itemTitleContainer}>
            <div className={styles.title}>{title}</div>
          </div>
          <div className={styles.itemIconContainer}>
            <div className={styles.icon}>
              <Icon path={mdiChevronRight} size={1} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});

const Settings = ({}: Props) => {
  const router = useRouter();
  const { locale } = router;
  const { pathArray: queryPaths } = router.query;
  var pathArray = queryPaths as string[];

  const changeLanguage = (e: any) => {
    const locale = e.target.value;
    router.push(router.pathname, router.asPath, { locale });
    if (typeof window !== "undefined")
      document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
  };

  if (pathArray && pathArray.length > 1) {
    return <></>;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.title}>General</div>
          </div>
        </div>
        <div className={"settings-items"}>
          <div className={styles.item}>
            <div className={styles.borderContainer}>
              <div className={styles.border} />
            </div>
            <div className={styles.itemContainer}>
              <div className={styles.itemTitleContainer}>
                <div className={styles.title}>{"Language"}</div>
              </div>
              <div className={styles.itemSwitchContainer}>
                <select
                  onChange={changeLanguage}
                  defaultValue={locale}
                  className="text-white text-base p-2 bg-transparent tracking-wide hover:bg-grey-lighter rounded-md uppercase border-2 border-transparent  cursor-pointer"
                >
                  {router.locales?.map((l) => (
                    <option value={l} key={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.borderContainer}>
              <div className={styles.border} />
            </div>
            <div className={styles.itemContainer}>
              <div className={styles.itemTitleContainer}>
                <div className={styles.title}>{"Dark Mode"}</div>
              </div>
              <div className={styles.itemSwitchContainer}>
                <Switch defaultChecked disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.title}>Information</div>
          </div>
        </div>
        <div className={"settings-items"}>
          <SettingsItem title={"Privacy"} link={"/settings/privacy"} />
          <SettingsItem
            title={"Terms of Service"}
            link={"/settings/terms-of-service"}
          />
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.copyright}>
          {new Date().getFullYear()} © WI20C. No rights reserved.
        </div>
      </div>
    </>
  );
};

export default Settings;
