const STORAGE_KEY = 'pixabayUser';

export const getUserCredentials = (email, token) => {
  const user = localStorage.getItem(STORAGE_KEY, { email, token });
  if (user) {
    return JSON.parse(user);
  } else {
    return null;
  }
};

export const storeUserCredentials = (email, token) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, token }));
};
