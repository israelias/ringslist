import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  center: {
    height: '60vh',
  },
  paper: {
    padding: theme.spacing(0),
    borderRadius: '0',
  },
  paperImagePreview: {
    paddingTop: 30,
  },
  paperImage: {
    padding: theme.spacing(4),
    borderRadius: '0',
    marginTop: 25,
    marginLeft: 25,
    ['@media (max-width:600px)']: {
      marginLeft: -20,
      marginRight: -20,
    },
  },
  paperRight: {
    padding: theme.spacing(4),
    borderRadius: '0',
    paddingLeft: 40,
    paddingTop: 30,
    ['@media (max-width:600px)']: {
      paddingLeft: 20,
      paddingTop: 10,
    },
  },
}));
