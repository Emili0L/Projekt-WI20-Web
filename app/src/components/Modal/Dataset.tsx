import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogProps,
  DialogContent,
  IconButton,
  Button,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { mdiClose, mdiInformationOutline } from "@mdi/js";
import React, { memo } from "react";
import Icon from "@mdi/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import en from "../../locales/en";
import de from "../../locales/de";
import TempRiseLineChart from "../Chart/TempRiseLineChart";

type BasicDialogProps = {
  onClose: (() => void) | ((e: any) => void);
  dialogProps?: Omit<DialogProps, "open" | "onClose">;
  maxWidth?: "sm" | "xs" | "md" | "lg" | "xl" | false;
  titleProps?: {
    id?: string;
    "aria-labelledby"?: string;
  };
};

const DatasetModal = memo(
  ({ onClose, dialogProps, maxWidth = "xs", titleProps }: BasicDialogProps) => {
    const router = useRouter();
    const t = router.locale === "de" ? de : en;
    const { resolvedTheme: theme } = useTheme();

    const muiTheme = createTheme({
      palette: {
        mode: theme as any,
        background: {
          default: theme === "dark" ? "none" : "#fff",
          paper: theme === "dark" ? "none" : "#fff",
        },
      },
    });

    const handleClose = (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      onClose(e);
    };

    const createDialogProps: DialogProps = {
      open: true,
      onClose: handleClose,
      maxWidth: maxWidth,
      fullWidth: true,
      PaperProps: {
        style: {
          overflow: "visible",
        },
      },
      ...dialogProps,
    };

    return (
      <ThemeProvider theme={muiTheme}>
        <Dialog {...createDialogProps}>
          <DialogTitle id={titleProps?.id}>
            {t.datasetModal.title}
            <IconButton
              type="reset"
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Icon path={mdiClose} size={1.0} />
            </IconButton>
          </DialogTitle>
          <DialogContent
            sx={{
              overflow: "visible",
            }}
          >
            <div className="h-full w-full">
              <TempRiseLineChart />
            </div>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                window.open(
                  "https://www.ncei.noaa.gov/products/land-based-station/noaa-global-temp",
                  "_blank"
                );
              }}
              variant="outlined"
              startIcon={<Icon path={mdiInformationOutline} size={1.0} />}
            >
              {t.datasetModal.learnMore}
            </Button>
            <Button onClick={handleClose} color="primary">
              {t.close}
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    );
  }
);

DatasetModal.displayName = "DatasetModal";

export { DatasetModal };
