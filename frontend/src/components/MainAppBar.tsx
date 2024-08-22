import { AppBar, Toolbar, Typography } from "@mui/material";

/**
 * Main app bar for the application.
 * @param props Props for the app bar. Contains the title of the app.
 *
 * @constructor
 */
export function MainAppBar(props: { title: string }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5">{props.title}</Typography>
      </Toolbar>
    </AppBar>
  );
}
