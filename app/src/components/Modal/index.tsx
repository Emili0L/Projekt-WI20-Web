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
import { mdiClose, mdiRestart } from "@mdi/js";
import React, { memo } from "react";
import Icon from "@mdi/react";
import { useTheme } from "next-themes";
import useSWRImmutable from "swr/immutable";
import { useMainContext } from "../Layout/Layout";
import { LineChart } from "../Chart";

interface ChartData {
  tmin: number;
  tmax: number;
  year?: number;
  month?: number;
  day?: number;
}

type DialogContext = {
  currentView: "month" | "year" | "all";
  setCurrentView: (view: "month" | "year" | "all") => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  data: ChartData[];
  setData: (data: ChartData[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  shouldReset: boolean;
  setShouldReset: (reset: boolean) => void;
};

const DialogContext = React.createContext<DialogContext>({
  currentView: "all",
  setCurrentView: () => {},
  selectedYear: 0,
  setSelectedYear: () => {},
  selectedMonth: 0,
  setSelectedMonth: () => {},
  data: null,
  setData: () => {},
  loading: true,
  setLoading: () => {},
  shouldReset: false,
  setShouldReset: () => {},
});

export const useDialogContext = () => React.useContext(DialogContext);

type BasicDialogProps = {
  open: boolean;
  onClose: (() => void) | ((e: any) => void);
  dialogProps?: Omit<DialogProps, "open" | "onClose">;
  maxWidth?: "sm" | "xs" | "md" | "lg" | "xl" | false;
  titleProps?: {
    id?: string;
    "aria-labelledby"?: string;
  };
};

const BasicDialog = memo(
  ({
    open,
    onClose,
    dialogProps,
    maxWidth = "xs",
    titleProps,
  }: BasicDialogProps) => {
    const { selectedMarker } = useMainContext();
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
      setCurrentView("all");
      setSelectedYear(0);
    };

    const createDialogProps: DialogProps = {
      open,
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

    const [currentView, setCurrentView] = React.useState<
      "month" | "year" | "all"
    >("all");
    const [selectedYear, setSelectedYear] = React.useState<number>(0);
    const [selectedMonth, setSelectedMonth] = React.useState<number>(0);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [data, setData] = React.useState<ChartData[]>([]);
    const [shouldReset, setShouldReset] = React.useState<boolean>(false);

    useSWRImmutable(
      selectedMarker !== null && `/api/station/${selectedMarker.name}`,
      {
        onSuccess: (data) => {
          console.log(data);
          setData(data.data);
          setLoading(false);
        },
      }
    );

    const title = React.useMemo(() => {
      if (selectedMarker === null) return "Loading...";
      var rightSide = "";
      if (currentView === "all" && data.length > 0) {
        rightSide = `(${data[0].year} - ${data[data.length - 1].year})`;
      } else if (currentView === "year") {
        rightSide = `${selectedYear}`;
      } else if (currentView === "month") {
        const month = new Date(selectedYear, selectedMonth, 1).toLocaleString(
          "default",
          { month: "long" }
        );
        rightSide = `${month} ${selectedYear}`;
      }
      return `${selectedMarker.name} - ${rightSide}`;
    }, [currentView, selectedMarker, data]);

    return (
      <ThemeProvider theme={muiTheme}>
        <DialogContext.Provider
          value={{
            currentView,
            setCurrentView,
            selectedYear,
            setSelectedYear,
            selectedMonth,
            setSelectedMonth,
            data,
            setData,
            loading,
            setLoading,
            shouldReset,
            setShouldReset,
          }}
        >
          <Dialog {...createDialogProps}>
            <DialogTitle id={titleProps?.id}>
              {title}
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
                {data.length > 0 && <LineChart />}
                {data.length === 0 && (
                  <div className="flex justify-center items-center h-full w-full">
                    <p>No data available</p>
                  </div>
                )}
              </div>
            </DialogContent>

            <DialogActions>
              {currentView !== "all" && (
                <Button
                  onClick={() => {
                    setShouldReset(true);
                  }}
                  variant="outlined"
                >
                  <Icon path={mdiRestart} size={1.0} />
                  Reset
                </Button>
              )}

              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </DialogContext.Provider>
      </ThemeProvider>
    );
  }
);

BasicDialog.displayName = "BasicDialog";

export { BasicDialog };
