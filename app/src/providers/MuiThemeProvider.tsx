import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTheme } from "next-themes";

const MuiThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme: theme } = useTheme();

  const muiTheme = createTheme({
    palette: {
      mode: theme as any,
      primary: {
        main: "rgb(0, 200, 100)",
      },
    },
  });
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
};

export default MuiThemeProvider;
