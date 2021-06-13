import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';

import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  IconButton,
  Button,
} from '@material-ui/core';
import AddSharp from '@material-ui/icons/AddSharp';

import { Category } from '../interfaces';

import { useUserContext } from '../context/user.context';
import { useDataHandler } from '../context/data.context';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: '#2d2d2d',
    display: 'flex',
    justifyContent: 'space-between',
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarMain: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
    overflowX: 'auto',
    backgroundColor: '#525050',
    color: '#fff',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
  appbarPromotion: {
    backgroundColor: '#2d2d2d',
    color: '#fff',
  },
  toolbarPromotion: {
    padding: '0px',
    minHeight: 50,
  },
}));

type Props = {
  categories: Category[];
};

const Navbar = ({ categories }: Props) => {
  const classes = useStyles();
  const { loggedIn, username, userId, handleSignOut } =
    useUserContext();
  const { setHeading, setEditing } = useDataHandler();
  const router = useRouter();
  return (
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <Link href="/home">
          <Typography
            component="h1"
            variant="h4"
            align="center"
            color="primary"
            noWrap
            style={{ cursor: 'pointer', paddingRight: '36px' }}
          >
            RingsListings
          </Typography>
        </Link>
        <Toolbar className={classes.toolbarMain}>
          {loggedIn && (
            <Link href={`profile/${encodeURIComponent(userId)}`}>
              <Typography
                variant="h6"
                color="secondary"
                component="h2"
                style={{ cursor: 'pointer', paddingRight: '36px' }}
              >
                {username}
              </Typography>
            </Link>
          )}

          <IconButton
            onClick={() => {
              setEditing(false);
              setHeading('New Listing');

              router.push({ pathname: `/add` });
            }}
          >
            <AddSharp
              color="secondary"
              style={{ fontSize: 30 }}
              fontSize="large"
            />
          </IconButton>
          {loggedIn ? (
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              href="/"
            >
              Register
            </Button>
          )}
        </Toolbar>
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        className={classes.toolbarSecondary}
      >
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/category/${encodeURIComponent(category.id)}`}
          >
            <Typography
              component="a"
              variant="body2"
              noWrap
              className={classes.toolbarLink}
              style={{ cursor: 'pointer' }}
            >
              {' '}
              {category.name}
            </Typography>
          </Link>
        ))}
      </Toolbar>
      <AppBar
        position="relative"
        elevation={0}
        className={classes.appbarPromotion}
      >
        <Container maxWidth="lg">
          <Toolbar className={classes.toolbarPromotion}></Toolbar>
        </Container>
      </AppBar>
    </React.Fragment>
  );
};

export default Navbar;
