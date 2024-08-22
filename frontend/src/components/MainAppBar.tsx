import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

/**
 * Main app bar for the application.
 * @param props Props for the app bar. Contains the title of the app.
 *
 * @constructor
 */
export function MainAppBar(props: {
  title: string;
  onBackClicked?: () => void;
}) {
  return (
    <AppBar position="static">
      <Toolbar>
        {props.onBackClicked ? (
          <IconButton onClick={props.onBackClicked}>
            <ArrowBack />
          </IconButton>
        ) : null}
        <Typography variant="h5">{props.title}</Typography>
      </Toolbar>
    </AppBar>
  );
}
