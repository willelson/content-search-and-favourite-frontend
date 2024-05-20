import imageIcon from '../icons/imageIcon.png';
import videoIcon from '../icons/videoIcon.png';

import styles from '../styles/ImageList.module.css';
import { API_BASE } from '../helpers/constants';
import { getUserCredentials } from '../helpers/tokenManager';

import { PixabayItem } from '../types/pixabayTypes';

type ImageListProps = {
  content: PixabayItem[];
  toggleContentStatus: () => void;
};

export default function ImageList({
  content,
  toggleContentStatus
}: ImageListProps) {
  const addFavourite = async (item: PixabayItem) => {
    const { pixabayId, contentType } = item;

    const { token } = getUserCredentials();

    const url = `${API_BASE}/favourites`;
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
      toggleContentStatus();
    } else if ([400, 401].includes(response.status)) {
      const errors = await response.json();
      alert(errors.errors.join('\n'));
    } else {
      alert(
        'There was a problem adding this item to your favourites. Please try again later.'
      );
    }
  };

  const removeFavourite = async (item: PixabayItem) => {
    const { pixabayId, contentType } = item;

    const { token } = getUserCredentials();

    const url = `${API_BASE}/favourites/${item.userFavouriteId}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({ pixabayId, contentType })
    });

    // Handle response
    if (response.status === 202) {
      toggleContentStatus();
    } else if ([400, 401].includes(response.status)) {
      const errors = await response.json();
      alert(errors.errors.join('\n'));
    } else {
      alert(
        'There was a problem removing this item from your favourites. Please try again later.'
      );
    }
  };

  const toggleFavourite = (item: PixabayItem) => {
    if (item.userFavouriteId !== null) {
      removeFavourite(item);
    } else {
      addFavourite(item);
    }
  };

  const thumnails = content.map((item: PixabayItem) => {
    // Check if this item already favourited by the user
    const isFavourite = item.userFavouriteId !== null;
    const buttonText = isFavourite ? 'Remove favourite' : 'Add favourite';

    const imageSrc = item?.contentType === 'image' ? imageIcon : videoIcon;
    const tooltipText =
      item?.contentType === 'image' ? 'image content' : 'video content';

    // Create unique identifier for each image
    const uniqueIdentifier = `${item.contentType}-${item.pixabayId}`;

    return (
      <li key={uniqueIdentifier}>
        <div>
          <img
            src={item.thumbnail}
            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            alt='image content'
          />
        </div>
        <div className={styles.controls}>
          <button onClick={() => toggleFavourite(item)}>{buttonText}</button>
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
