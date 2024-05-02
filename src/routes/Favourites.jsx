import { useState, useEffect } from 'react';
import { getUserCredentials } from './helpers/tokenManager';

import ImageList from './ImageList';

export default function Favourites() {
  const [content, setContent] = useState([]);

  useEffect(() => {
    getFavourites();
  }, []);

  const getFavourites = async () => {
    // get token from storage
    const { token } = getUserCredentials();
    const url = 'http://localhost:3000/api/v1/favourites';

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

  const message =
    content.length > 0
      ? 'Your favourite images and videos'
      : 'Your do not have any favourite images or videos';

  return (
    <>
      <div>{message}</div>
      <ImageList content={content} toggleContentStatus={toggleContentStatus} />
    </>
  );
}
