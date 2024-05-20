import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  getUserCredentials,
  removeUserCredentials
} from '../helpers/tokenManager';
import { SearchContextProvider } from '../context/searchContext';

import styles from '../styles/Layout.module.css';

export default function Content() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const credentials = getUserCredentials();
    if (credentials.email.length > 0) {
      setEmail(() => credentials.email);
    }
  }, []);

  const logout = () => {
    removeUserCredentials();
    navigate('login');
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.navButtons}>
          <Link
            to='/search'
            className={
              location.pathname.includes('search') ? styles.currentRoute : ''
            }
          >
            Search
          </Link>
          <Link
            to='/favourites'
            className={
              location.pathname.includes('favourite') ? styles.currentRoute : ''
            }
          >
            Favourites
          </Link>
        </div>
        <div className={styles.userInfo}>
          Logged in as {email}
          <button onClick={logout} style={{ marginLeft: '12px' }}>
            Logout
          </button>
        </div>
      </div>

      <SearchContextProvider>
        <Outlet />
      </SearchContextProvider>
    </>
  );
}
