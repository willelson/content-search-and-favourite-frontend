import { useState, useEffect } from 'react';
import { getUserCredentials } from './helpers/tokenManager';

import ImageList from './ImageList';
import Pagination from './Pagination';

export default function Favourites() {
  const [content, setContent] = useState([]);

  // Manage pagination
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    getFavourites();
  }, []);

  const getFavourites = async (queryPage = page) => {
    // Get token from storage
    const { token } = getUserCredentials();
    const url = `http://localhost:3000/api/v1/favourites?page=${queryPage}`;

    const response = await fetch(url, {
      headers: {
        Authorization: token
      }
    });

    // Handle server response
    if (response.status === 200) {
      const data = await response.json();

      // Add favourite flag as this feature is not yet supported by the api
      const content = data.content.map((item) => ({
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

  const toggleContentStatus = () => {
    // refetch favourites whenever a toggle changes
    getFavourites();
  };

  // Get new page results when pagination changes
  const changePagination = (page) => getFavourites(page);

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
            changePage={changePagination}
          />
        </>
      )}
    </>
  );
}
