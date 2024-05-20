// Key used to add user credentials to local stoarge.
const STORAGE_KEY = 'pixabayUser';

type UserCredentials = {
  email: string;
  token: string;
};

/**
 * Pulls user credentials from localStorage and parses them into an object.
 */
export const getUserCredentials = (): UserCredentials => {
  const user = localStorage.getItem(STORAGE_KEY);
  if (user) {
    return JSON.parse(user);
  } else {
    return { email: '', token: '' };
  }
};

/**
 * Save user credentials to local storage.
 */
export const storeUserCredentials = (email: string, token: string): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, token }));
};

/**
 * Remove user credentials from local storage.
 */
export const removeUserCredentials = (): void =>
  localStorage.removeItem(STORAGE_KEY);
