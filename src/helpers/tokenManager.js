const STORAGE_KEY = 'pixabayUser';

export const getUserCredentials = () => {
  const user = localStorage.getItem(STORAGE_KEY);
  if (user) {
    return JSON.parse(user);
  } else {
    return null;
  }
};

export const storeUserCredentials = (email, token) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, token }));
};

export const removeUserCredentials = () => localStorage.removeItem(STORAGE_KEY);
