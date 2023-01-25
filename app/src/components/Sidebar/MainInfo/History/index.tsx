import en from "../../../../locales/en";
import de from "../../../../locales/de";
import { useRouter } from "next/router";

const History = () => {
  const router = useRouter();
  const t = router.locale === "en" ? en : de;
  return <></>;
};

export default History;
