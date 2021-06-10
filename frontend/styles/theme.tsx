import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#9d9c7b',
    },
    secondary: {
      main: '#f8c554',
    },
    error: {
      main: '#ff5470',
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;
