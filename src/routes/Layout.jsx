import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  getUserCredentials,
  removeUserCredentials
} from './helpers/tokenManager';

import styles from './styles/Layout.module.css';

export default function Content() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const credentials = getUserCredentials();
    if (credentials) {
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
          <Link to='/search'>Search</Link>
          <Link to='/favourites'>Favourites</Link>
        </div>
        <div className={styles.userInfo}>
          Logged in as {email}
          <button onClick={logout} style={{ marginLeft: '12px' }}>
            Logout
          </button>
        </div>
      </div>

      <Outlet />
    </>
  );
}
