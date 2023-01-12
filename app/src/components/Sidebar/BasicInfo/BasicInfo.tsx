import { Button } from "@mui/material";
import { useState } from "react";
import { BasicDialog } from "../../";
import { BasicLineChart } from "../../Chart";
import styles from "./BasicInfo.module.scss";

const BasicInfo = () => {
  // const [nearestStation, setNearestStation] = useState<Station | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.container}>
      Nearest Station & CTA to view its diagrams
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        View
      </Button>
      <BasicDialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        title="Graphen"
        maxWidth="md"
      >
        <div className="h-full w-full">
          <BasicLineChart />
        </div>
      </BasicDialog>
    </div>
  );
};

export default BasicInfo;
