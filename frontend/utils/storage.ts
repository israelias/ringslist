/**
 * Utility object with keys to functions pertaining to local storage management.
 *
 * @see UserProvider
 */

export const storage = {
  getToken: () =>
    JSON.parse(window.localStorage.getItem('token') || '{}'),
  setToken: (token: string) =>
    window.localStorage.setItem('token', JSON.stringify(token)),
  clearToken: () => window.localStorage.removeItem('token'),
  setUserLocal: (username: string) =>
    localStorage.setItem('username', username),
  getUserLocal: () =>
    JSON.parse(window.localStorage.getItem('username') || ''),
  clearUserLocal: () => window.localStorage.removeItem('username'),
  setLogoutEvent: () =>
    window.localStorage.setItem(
      'app_logout',
      JSON.stringify(Date.now())
    ),
};
