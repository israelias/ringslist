import fetch from 'isomorphic-unfetch';
import { RequestTicket } from './request.service';

/**
 * Package managers for CRUD operations via HTTP requests.
 *
 * Auth: Sign in, Sign up, Sign out.
 * General: Post, Put, Get => Add, Edit, etc.
 *
 * This file requires the modules {@link module:isomorphic-unfetch} for fetching the API.
 *
 * @requires isomorphic-unfetch
 * @see RequestTicket
 */

/**
 * Sign up request handler.
 *
 * @see RequestTicket
 * @param  {object} body body of sign up request (username and password)
 * @return {Promise} handles user's authentication passport once fulfilled
 */
export function signUpRequest({
  body,
}: {
  body: {
    username: string;
    password: string;
  };
}) {
  const request = RequestTicket({
    method: 'post',
    url: 'api/signup',
    body: {
      username: body.username,
      password: body.password,
    },
  });
  return fetch(request);
}

/**
 * Sign in request handler.
 *
 * @see RequestTicket
 * @param  {object} body body of sign up request (username and password)
 * @return {Promise} handles user's authentication passport once fulfilled
 */
export function signInRequest({
  body,
}: {
  body: {
    username: string;
    password: string;
  };
}) {
  const request = RequestTicket({
    method: 'post',
    url: 'api/signin',
    body: {
      username: body.username,
      password: body.password,
    },
  });
  return fetch(request);
}

/**
 * Sign out request handler.
 *
 * @see RequestTicket
 * @return {null} handles revoking of user's authentication passport without explicit return
 */
export function signOutRequest({
  accessToken,
}: {
  accessToken: string;
}) {
  const request = RequestTicket({
    method: 'post',
    url: 'api/signout',
    token: accessToken,
  });
  return fetch(request);
}
