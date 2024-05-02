import { useState, useEffect } from 'react';
import { getUserCredentials } from './helpers/tokenManager';

import ImageList from './ImageList';
import Pagination from './Pagination';

export default function Favourites() {
  const [content, setContent] = useState([]);

  // manage pagination
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    getFavourites();
  }, []);

  const getFavourites = async (queryPage = page) => {
    // get token from storage
    const { token } = getUserCredentials();
    const url = `http://localhost:3000/api/v1/favourites?page=${queryPage}`;

    // make req to server
    const response = await fetch(url, {
      headers: {
        Authorization: token
      }
    });

    if (response.status === 200) {
      const data = await response.json();

      const content = data.content.map((item) => ({
        ...item,
        favourite: true
      }));

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
