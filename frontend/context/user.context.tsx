/* eslint-disable no-console */
import * as React from 'react';
import { useRouter } from 'next/router';

import Toast from '../components/Toast';
import { storage } from '../utils/storage';
import {
  signInRequest,
  signUpRequest,
  signOutRequest,
} from '../services/auth.service';

import { deleteRequest } from '../services/crud.service';

/**
 * Top-most Context provider for all user authentication: form values, auth errors etc.
 *
 */

export type UserContent = {
  userId: number | string;
  setUserId: React.Dispatch<React.SetStateAction<number | string>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  heading: string;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  alert: boolean;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  returning: boolean;
  setReturning: React.Dispatch<React.SetStateAction<boolean>>;
  handleSignIn: (
    e: React.FormEvent<HTMLFormElement>
  ) => Promise<void>;
  handleSignOut: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => Promise<void>;
  handleDelete: (
    e: React.FormEvent<HTMLFormElement>
  ) => Promise<void>;
};

export const UserContext = React.createContext<UserContent>(
  undefined!
);

export function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userId, setUserId] = React.useState<number | string>(0);
  const [username, setUsername] = React.useState('');
  const [accessToken, setAccessToken] = React.useState('');
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [password, setPassword] = React.useState('');
  const [heading, setHeading] = React.useState('');
  const [alert, setAlert] = React.useState(false);
  const [returning, setReturning] = React.useState(true);

  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openWarning, setOpenWarning] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);

  const [message, setMessage] = React.useState<string | any>('');
  const onSuccess = (text: string | any) => {
    setMessage(text);
    setOpenSuccess(true);
    setTimeout(() => {
      setOpenSuccess(false);
      setMessage('');
    }, 1750);
  };
  const onWarning = (text: string | any) => {
    setMessage(text);
    setOpenWarning(true);
    setTimeout(() => {
      setOpenWarning(false);
      setMessage('');
    }, 1750);
  };
  const onError = (text: string | any) => {
    setMessage(text);
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
      setMessage('');
    }, 1750);
  };

  const router = useRouter();

  const handleSignIn = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    if (!returning) {
      try {
        await signUpRequest({
          body: {
            username,
            password,
          },
        }).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              if (data.access_token) {
                setUsername('');
                setPassword('');
                setAccessToken(data.access_token);
                setUsername(data.username);
                setUserId(data.user_id);
                setLoggedIn(true);
                storage.setUserLocal(data.username);

                setTimeout(() => {
                  onSuccess('Account Created');
                }, 750);
                setTimeout(() => {
                  setLoading(false);
                  router.push({
                    pathname: `/home`,
                  });
                }, 1500);
              }
            });
          } else {
            response.json().then((data) => {
              if (data.message) {
                setLoading(false);
                onWarning(data.message);
              }
            });
          }
        });
      } catch (err: any) {
        setLoading(false);
        onError(err?.message || 'Something went wrong.');
      }
    } else {
      try {
        await signInRequest({
          body: {
            username,
            password,
          },
        }).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              if (data.access_token) {
                setUsername('');
                setPassword('');
                setAccessToken(data.access_token);
                setUsername(data.username);
                setUserId(data.user_id);
                setLoggedIn(true);
                storage.setUserLocal(data.username);
                setTimeout(() => {
                  onSuccess(`Welcome Back, ${data.username}`);
                }, 750);
                setTimeout(() => {
                  setLoading(false);
                  router.push(`/home`);
                }, 1500);
              } else {
                setLoading(false);
                onError(`Access Failed: ${data?.message}`);
              }
            });
          } else {
            response.json().then((data) => {
              if (data.message) {
                setLoading(false);
                onWarning(data.message);
              }
            });
          }
        });
      } catch (err: any) {
        setLoading(false);
        onError(err.message);
      }
    }
  };

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    onSuccess('Signing out...');

    try {
      await signOutRequest({ accessToken }).then((response) => {
        if (response.ok) {
          setAccessToken('');
          setUsername('');
          setUserId('');
          setLoggedIn(false);
          setReturning(true);
          storage.clearUserLocal();
          storage.setLogoutEvent();
          setTimeout(() => {
            onSuccess('Signed out');
          }, 250);
          setTimeout(() => {
            setLoading(false);
            router.push(`/`);
          }, 750);
        } else {
          setLoading(false);
          onWarning('Sign out failed');
        }
      });
    } catch (err: any) {
      onError(err.message);
    }
  };

  const handleDelete = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteRequest({
        url: `api/users/${userId}`,
        accessToken,
      }).then((res) => {
        if (res.ok) {
          setAccessToken('');
          setUsername('');
          setUserId('');
          setLoggedIn(false);
          storage.clearUserLocal();
          storage.setLogoutEvent();
          setTimeout(() => {
            onSuccess('Account deleted');
          }, 750);
          setTimeout(() => {
            setLoading(false);

            router.push('/');
          }, 1500);
        } else {
          setLoading(false);
          onWarning('Request failed');
        }
      });
    } catch (err: any) {
      setLoading(false);
      onError(err.message);
    }
  };

  React.useEffect(() => {
    function checkUserData(e: StorageEvent) {
      if (e.key === 'app_logout') {
        setAccessToken('');
        setUsername('');
        setUserId('');
        setLoggedIn(false);
        setReturning(true);
        onError("Oops. It seems you've been logged out.");
      }
    }
    window.addEventListener('storage', (e) => checkUserData(e));
    return () => {
      window.removeEventListener('storage', (e) => checkUserData(e));
    };
  }, []);

  React.useEffect(() => {
    if (!(username || accessToken)) {
      router.push('/');
    }
  }, [username, accessToken]);

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        username,
        setUsername,
        accessToken,
        setAccessToken,
        loggedIn,
        setLoggedIn,
        loading,
        setLoading,
        handleSignIn,
        handleSignOut,
        handleDelete,
        password,
        setPassword,
        heading,
        setHeading,
        alert,
        setAlert,
        returning,
        setReturning,
      }}
    >
      {children}
      <Toast
        open={openSuccess}
        setOpen={setOpenSuccess}
        success
        message={message}
      />
      <Toast
        open={openWarning}
        setOpen={setOpenWarning}
        warning
        message={message}
      />
      <Toast
        open={openError}
        setOpen={setOpenError}
        error
        message={message}
      />
    </UserContext.Provider>
  );
}

export const useUserContext = () => React.useContext(UserContext);
