import PropTypes from 'prop-types';

import styles from './styles/ImageList.module.css';
import { getUserCredentials } from './helpers/tokenManager';

export default function ImageList({
  content,
  toggleContentStatus,
  showRemove = true
}) {
  const addFavourite = async (item) => {
    const { pixabayId, contentType } = item;

    // get token from storage
    const { token } = getUserCredentials();

    const url = 'http://localhost:3000/api/v1/favourites';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pixabayId, contentType })
    });

    if (response.status === 201) {
      const data = await response.json();
      toggleContentStatus(pixabayId);
    } else if ([400, 401].includes(response.status)) {
      const errors = await response.json();
      alert(errors.errors.join('\n'));
    } else {
      alert(
        'There was a problem adding this item to your favourites. Please try again later.'
      );
    }
  };

  const removeFavourite = async (item) => {
    const { pixabayId, contentType } = item;

    // get token from storage
    const { token } = getUserCredentials();

    const url = `http://localhost:3000/api/v1/favourites/${item.id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({ pixabayId, contentType })
    });

    if (response.status === 202) {
      toggleContentStatus(pixabayId);
    } else if ([400, 401].includes(response.status)) {
      const errors = await response.json();
      alert(errors.errors.join('\n'));
    } else {
      alert(
        'There was a problem removing this item from your favourites. Please try again later.'
      );
    }
  };

  const toggleFavourite = (item) => {
    if (item?.favourite) {
      removeFavourite(item);
    } else {
      addFavourite(item);
    }
  };

  const thumnails = content.map((item) => {
    let showButton = true;
    if (!showRemove && item?.favourite === true) {
      showButton = false;
    }
    const showFavouritedMsg = !showRemove && item?.favourite === true;

    const buttonText = item?.favourite ? 'Remove favourite' : 'Add favourite';
    return (
      <li key={item.id} style={{ padding: '10px' }}>
        <div>
          <img
            src={item.thumbnail}
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
        </div>
        {showButton && (
          <button onClick={() => toggleFavourite(item)}>{buttonText}</button>
        )}
        {showFavouritedMsg && <p style={{ margin: '0px' }}>Favourited!</p>}
      </li>
    );
  });

  return <ul className={styles.gridContainer}>{thumnails}</ul>;
}

ImageList.propTypes = {
  content: PropTypes.array,
  toggleContentStatus: PropTypes.func,
  isStudent: PropTypes.bool
};
