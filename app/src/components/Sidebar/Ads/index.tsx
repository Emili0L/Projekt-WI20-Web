import Script from "next/script";
import styles from "./Ad.module.scss";

const Ad = () => {
  return (
    <>
      <div className={styles.container}>
        {/* <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-987************676"
          data-ad-slot="776****95"
          data-ad-format="auto"
          data-full-width-responsive="true"
        >
          {" "}
        </ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script> */}
      </div>
    </>
  );
};

export default Ad;
