import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
// import UserDropdown from './UserDropdown';

const Divider = () => (
  <div className="mx-4 w-0 h-1/2 border-r border-gray-400 border-solid" />
);

type Props = {
  layout?: any;
  title?: string;
  isOpen: boolean;
  menuToggle: () => void;
};

const Header: React.FC<Props> = ({ title, isOpen, menuToggle, layout }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const { locale } = router;

  /** @todo Persist Selection  */
  const changeLanguage = (e: any) => {
    const locale = e.target.value;
    router.push(router.pathname, router.asPath, { locale });
  };
  const { data: session } = useSession();
  const userName = session?.user?.name as string;

  return (
    <nav className="flex z-10 justify-between items-center h-12 bg-white shadow-sm dark:bg-grey">
      <div className="flex flex-row items-center">
        {layout !== "external" ? (
          <>
            <button
              type="button"
              className="bg-transparent p-2 hover:bg-grey-lighter flex items-center a-font-14 m-4 rounded-md"
              onClick={() => menuToggle()}
            >
              <span
                className={
                  "appkiticon a-font-24 " +
                  (isOpen ? "icon-close-outline " : "icon-menu-outline")
                }
              />
            </button>
            <Link href="/" passHref>
              <p className="font-medium dark:text-white ml-4">{title}</p>
            </Link>
          </>
        ) : (
          <p className="font-medium dark:text-white ml-16">{title}</p>
        )}
      </div>
      <div className="flex gap-2 items-center">
        {layout !== "external" && (
          <button
            type="button"
            className="flex p-2 bg-transparent items-center hover:bg-grey-lighter rounded-md"
          >
            <span className="appkiticon icon-notification-outline a-font-24" />
          </button>
        )}
        {/* <LocaleSwitcher /> */}
        <select
          onChange={changeLanguage}
          defaultValue={locale}
          className="text-lg p-2 bg-transparent tracking-wide hover:bg-grey-lighter rounded-md uppercase border-2 border-transparent rounded-lg cursor-pointer focus:ring-2"
        >
          {router.locales?.map((l) => (
            <option value={l} key={l}>
              {l}
            </option>
          ))}
        </select>
        {/* {layout !== 'external' && <UserDropdown userName={userName} />} */}
      </div>
    </nav>
  );
};

export default Header;
