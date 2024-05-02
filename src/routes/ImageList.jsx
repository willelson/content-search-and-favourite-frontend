import PropTypes from 'prop-types';

import imageIcon from './icons/imageIcon.png';
import videoIcon from './icons/videoIcon.png';

import styles from './styles/ImageList.module.css';
import { getUserCredentials } from './helpers/tokenManager';

export default function ImageList({
  content,
  toggleContentStatus,
  showRemove = true
}) {
  const addFavourite = async (item) => {
    const { pixabayId, contentType } = item;

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

    // Handle responses
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

    const { token } = getUserCredentials();

    const url = `http://localhost:3000/api/v1/favourites/${item.id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({ pixabayId, contentType })
    });

    // Handle response
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

    /**
     * If this is the search area we show "favourited" after an item is marked as favourited
     * REmoving favourites from the search area is not yet supported.
     */
    const showFavouritedMsg = !showRemove && item?.favourite === true;
    const buttonText = item?.favourite ? 'Remove favourite' : 'Add favourite';

    const imageSrc = item?.contentType === 'image' ? imageIcon : videoIcon;
    const tooltipText =
      item?.contentType === 'image' ? 'image content' : 'video content';

    return (
      <li key={item.id}>
        <div>
          <img
            src={item.thumbnail}
            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            alt='image content'
          />
        </div>
        <div className={styles.controls}>
          {showButton && (
            <button onClick={() => toggleFavourite(item)}>{buttonText}</button>
          )}

          {showFavouritedMsg && (
            <p className={styles.favouritedMessage}>Favourited!</p>
          )}
          <img
            className={styles.contentIcon}
            src={imageSrc}
            alt={tooltipText}
            title={tooltipText}
          />
        </div>
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
