import { Outlet, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import styles from './styles/Layout.module.css';

export default function Content() {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.navButtons}>
          <Link to='/search'>Search</Link>
          <Link to='/favourites'>Favourites</Link>
        </div>
        <div className={styles.userInfo}>
          Logged in as bla@ma.com{' '}
          <button style={{ marginLeft: '12px' }}>Logout</button>
        </div>
      </div>

      <Outlet />
    </>
  );
}
