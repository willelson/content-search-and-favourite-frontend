import { Grid } from '@mantine/core';
import ImageCard from './ImageCard';
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

  const cards = content.map((item) => {
    // Create unique identifier for each card
    const uniqueIdentifier = `${item.contentType}-${item.pixabayId}`;
    return (
      <ImageCard
        item={item}
        loading={false}
        key={uniqueIdentifier}
        toggleFavourite={toggleFavourite}
      />
    );
  });

  return <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>{cards}</Grid>;
}
