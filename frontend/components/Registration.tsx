import React from 'react';
import {
  Avatar,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  CssBaseline,
  Button,
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { makeStyles } from '@material-ui/core/styles';

import { useUserContext } from '../context/user.context';
/**
 * Sign in template
 * @tutorial https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-in
 */

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const {
    username,
    setUsername,
    password,
    setPassword,
    handleSignIn,
    returning,
    setReturning,
  } = useUserContext();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {returning ? 'Sign in' : 'Sign up'}
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSignIn}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  setReturning(!returning);
                }}
              >
                {returning
                  ? "Don't have an account? Sign Up"
                  : 'Switch to Sign in '}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
