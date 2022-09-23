import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FC } from "react";

import { FireEmblemProvider } from "./contexts/fire-emblem";
import { PyodideProvider } from "./contexts/pyodide";
import { Index } from "./pages/Index";

const theme = createTheme();

export const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <PyodideProvider>
        <FireEmblemProvider>
          <CssBaseline/>
          <Index/>
        </FireEmblemProvider>
      </PyodideProvider>
    </ThemeProvider>
  );
};
