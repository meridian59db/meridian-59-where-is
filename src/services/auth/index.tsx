/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import api from '../api';

export const tokenKey = 'acessToken';

/**
 * Function used to check if user is logged in or not
 */
const isUserLogged = (): boolean => {
  return localStorage.getItem(tokenKey) !== null;
};

/**
 * Function used to get the logged in user's informations
 */
const getCurrentUser = async (): Promise<unknown> => {
  const user = await api.get(`/users/profile`, {
    headers: {
      Authorization: localStorage.getItem(tokenKey),
    },
  });
  return user;
};

/**
 * Checks if user is admin or normal member
 */
const checkUserPermission = async (): Promise<unknown> => {
  const response = await api.post(`/auth/permissions`, {
    params: {
      acessToken: localStorage.getItem(tokenKey),
    },
  });
  return response;
};

/**
 * Method triggered when we login
 *
 * @param {string} username User's usrname
 * @param {string} password User's password
 */
const login = async (username: string, password: string): Promise<unknown> => {
  const response = await api.post('/auth/login', {
    username,
    password,
  });
  return response;
};

/**
 * Triggered when we're logging out
 */
const logout = (pushToLogin: any): void => {
  localStorage.removeItem(tokenKey);
  if (pushToLogin) {
    pushToLogin();
  }
};

/**
 * Registers an user
 */
const registerUser = async (data: unknown): Promise<unknown> => {
  const response = await api
    .post('/users', data, {
      headers: {
        Authorization: localStorage.getItem(tokenKey),
      },
    })
    .catch((err: unknown) => {
      throw err;
    });
  return response;
};

export default {
  login,
  logout,
  getCurrentUser,
  isUserLogged,
  checkUserPermission,
  registerUser,
  tokenKey,
};
