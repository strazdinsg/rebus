import { createTheme } from "@mui/material";

/**
 * Theme for Material UI components
 * @type {Theme}
 */
export const muiTheme = createTheme({
  typography: {
    fontSize: 32, // default font size
    button: {
      fontSize: "3rem",
    },
  },
});
