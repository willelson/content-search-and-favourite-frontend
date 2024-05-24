import {
  ActionIcon,
  Card,
  Grid,
  Image,
  Group,
  Skeleton,
  Text,
  useComputedColorScheme
} from '@mantine/core';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { PixabayItem } from '../types/pixabayTypes';

type ImageCard = {
  loading: boolean;
  item: PixabayItem;
  toggleFavourite: (item: PixabayItem) => void;
};

function ImageCard({ loading, item, toggleFavourite }: ImageCard) {
  const computedColorScheme = useComputedColorScheme('light');
  const iconColor =
    computedColorScheme === 'dark'
      ? 'var(--mantine-primary-color-contrast)'
      : '';

  const gridSpan = { base: 20, xs: 20, sm: 10, md: 5, lg: 4 };

  const skeleton = (
    <Grid.Col span={gridSpan}>
      <Card withBorder>
        <Card.Section>
          <Skeleton height={160} />
        </Card.Section>

        <Group justify='space-between' mt='md' mb='xs'>
          <Skeleton height={12} mt={6} width='30%' radius='xl' />
          <Skeleton height={12} mt={6} width={20} radius='xl' mr={4} />
        </Group>
      </Card>
    </Grid.Col>
  );

  const card = (
    <Grid.Col span={gridSpan}>
      <Card withBorder>
        <Card.Section>
          <Image src={item.contentURL} height={160} alt='Pixabay image' />
        </Card.Section>

        <Group justify='space-between' mt='md'>
          <Text style={{ textTransform: 'capitalize' }}>
            {item.contentType}
          </Text>
          <Group style={{ gap: '4px' }}>
            <ActionIcon
              variant='transparent'
              aria-label='Favourite'
              onClick={() => toggleFavourite(item)}
            >
              {item.userFavouriteId !== null ? (
                <FaHeart size={20} color='mediumvioletred' />
              ) : (
                <FaRegHeart size={20} color={iconColor} />
              )}
            </ActionIcon>
          </Group>
        </Group>
      </Card>
    </Grid.Col>
  );

  return loading ? skeleton : card;
}

export default ImageCard;
