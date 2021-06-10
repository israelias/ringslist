import React from 'react';
import Link from 'next/link';

import {
  AppBar,
  Toolbar,
  List,
  ListItem,
  Container,
  Link as MLink,
  Typography,
} from '@material-ui/core';

import { useStyles } from '../styles/header.styles';
import { Category } from '../interfaces';

import { useUserContext } from '../context/user.context';

type Props = {
  categories: Category[];
};

function Header({ categories }: Props) {
  const classes = useStyles();
  const { loggedIn, username, userId, handleSignOut } =
    useUserContext();

  return (
    <nav>
      <AppBar
        position="relative"
        elevation={0}
        className={classes.appbarDesktop}
      >
        <Container maxWidth="lg">
          <Toolbar className={classes.toolbarDesktop}></Toolbar>
        </Container>
      </AppBar>
      <AppBar
        position="static"
        elevation={0}
        className={classes.appbarMain}
      >
        <Container maxWidth="lg">
          <Toolbar className={classes.toolbarMain}>
            <MLink href={`/`}>
              <>
                <Typography variant="h4" component="h1">
                  RingsListings
                </Typography>
              </>
            </MLink>
            {loggedIn && (
              <Link href={`profile/${encodeURIComponent(userId)}`}>
                <Typography
                  variant="h5"
                  color="secondary"
                  component="h2"
                  style={{ cursor: 'pointer' }}
                >
                  {username}
                </Typography>
              </Link>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <AppBar
        position="relative"
        elevation={0}
        className={classes.appbarSecondary}
      >
        <Container maxWidth="lg">
          <Toolbar className={classes.toolbarSecondary}>
            <List className={classes.menuList}>
              {categories.map((category) => (
                <ListItem
                  key={category.name}
                  className={classes.menuListItem}
                >
                  <Link
                    href={`/category/${encodeURIComponent(
                      category.id
                    )}`}
                  >
                    <a className={classes.listItemLink}>
                      {category.name}
                    </a>
                  </Link>
                </ListItem>
              ))}
            </List>
            {loggedIn ? (
              <MLink
                component="button"
                variant="body2"
                onClick={() => handleSignOut}
              >
                Sign Out
              </MLink>
            ) : (
              <MLink variant="body2" href="/">
                Register
              </MLink>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <AppBar
        position="relative"
        elevation={0}
        className={classes.appbarPromotion}
      >
        <Container maxWidth="lg">
          <Toolbar className={classes.toolbarPromotion}></Toolbar>
        </Container>
      </AppBar>
    </nav>
  );
}

export default Header;
