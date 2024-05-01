import { Outlet, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Content() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to='/search'>Search</Link>
          </li>
          <li>
            <Link to='/favourites'>Favourites</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
}
