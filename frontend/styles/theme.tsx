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

// appbarDesktop: {
//   backgroundColor: '#f8f8f8',
//   color: '#fff',
// },
// appbarMain: {
//   backgroundColor: '#2d2d2d',
// },
// appbarSecondary: {
//   backgroundColor: '#525050',
//   color: '#fff',
// },
// appbarPromotion: {
//   backgroundColor: '#2d2d2d',
//   color: '#fff',
//   margin: theme.spacing(0, 0, 8),
//   ['@media (max-width:600px)']: {
//     margin: theme.spacing(0, 0, 2),
//   },
// },
