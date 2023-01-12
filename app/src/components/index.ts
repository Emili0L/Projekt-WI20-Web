import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export { Map };
export { default as Sidebar } from "./Sidebar";
export { BasicDialog } from "./Modal";
