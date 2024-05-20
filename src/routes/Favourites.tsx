import React from 'react';

import { useState, useEffect } from 'react';
import { getUserCredentials } from '../helpers/tokenManager';
import { API_BASE } from '../helpers/constants';

import ImageList from '../utils/ImageList';
import Pagination from '../utils/Pagination';

import { PixabayItem } from '../types/pixabayTypes';

export default function Favourites() {
  const [content, setContent] = useState<Array<PixabayItem>>([]);

  // Manage pagination
  const [page, setPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);

  useEffect(() => {
    getFavourites(page);
  }, []);

  const getFavourites = async (queryPage: number): Promise<void> => {
    const { token } = getUserCredentials();
    const url = `${API_BASE}/favourites?page=${queryPage}`;

    const response = await fetch(url, {
      headers: {
        Authorization: token
      }
    });

    // Handle server response
    if (response.status === 200) {
      const data = await response.json();

      // Add favourite flag as this feature is not yet supported by the api
      const content = data.content.map((item: PixabayItem) => ({
        ...item,
        favourite: true
      }));

      // Add response to component state
      setContent(() => content);
      setPage(() => data.page);
      setTotalResults(() => data.total);
    } else if ([400, 401].includes(response.status)) {
      const errors = await response.json();
      alert(errors.errors.join(', '));
    } else {
      alert('There was a problem fetching data. Please try again later.');
    }
  };

  // Re-fetch favourites whenever a toggle changes
  const toggleContentStatus = () => getFavourites(page);

  // Get new page results when pagination changes
  const changePage = (newPage: number) => getFavourites(newPage);

  const message =
    content.length > 0
      ? 'Your favourite images and videos'
      : 'You do not have any favourite images or videos';

  return (
    <>
      <div>{message}</div>

      {content.length > 0 && (
        <>
          <ImageList
            content={content}
            toggleContentStatus={toggleContentStatus}
          />
          <Pagination
            page={page}
            totalResults={totalResults}
            changePage={changePage}
          />
        </>
      )}
    </>
  );
}
