import { NextPage } from "next";
import { Map } from "../components";

type Props = {};

const Home: NextPage<Props> = () => {
  return (
    <div className="h-full relative">
      <Map></Map>
    </div>
  );
};

export default Home;
