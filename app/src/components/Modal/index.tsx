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
import { mdiClose } from "@mdi/js";
import React, { memo } from "react";
import Icon from "@mdi/react";
import { useTheme } from "next-themes";

type BasicDialogProps = {
  open: boolean;
  onClose: (() => void) | ((e: any) => void);
  title: string | React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  showBackdrop?: boolean;
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
    children,
    title,
    showBackdrop,
    dialogProps,
    maxWidth = "xs",
    actions,
    titleProps,
  }: BasicDialogProps) => {
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

    return (
      <ThemeProvider theme={muiTheme}>
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
            {children}
          </DialogContent>

          <DialogActions>
            {actions || (
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    );
  }
);

BasicDialog.displayName = "BasicDialog";

export { BasicDialog };
