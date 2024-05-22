import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  AppShell,
  Button,
  Flex,
  Group,
  Text,
  useMantineColorScheme,
  useComputedColorScheme
} from '@mantine/core';
import { FaSun, FaMoon } from 'react-icons/fa';
import { MdLogout, MdOutlineExplore } from 'react-icons/md';

import {
  getUserCredentials,
  removeUserCredentials
} from '../helpers/tokenManager';
import { SearchContextProvider } from '../context/searchContext';

export default function Layout() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const credentials = getUserCredentials();
    if (credentials.email.length > 0) {
      setEmail(() => credentials.email);
    }
  }, []);

  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  const toggleColorScheme = () =>
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');

  const getLinkColour = (route: string): string =>
    location.pathname.includes(route) ? '' : 'gray';

  const logout = () => {
    removeUserCredentials();
    navigate('login');
  };

  return (
    <AppShell header={{ height: 60 }} padding='md'>
      <AppShell.Header>
        <Flex
          justify='space-between'
          align='center'
          style={{ padding: '10px 30px' }}
        >
          <Flex justify='space-between' align='center'>
            <Text size='lg' mr={48}>
              <Flex justify='space-between' align='center'>
                Pixabay{' '}
                <MdOutlineExplore size={26} style={{ marginLeft: '8px' }} />
              </Flex>
            </Text>
            <Button
              variant='subtle'
              size='sm'
              onClick={() => navigate('/search')}
              color={getLinkColour('search')}
            >
              Search
            </Button>
            <Button
              variant='subtle'
              size='sm'
              onClick={() => navigate('/favourites')}
              color={getLinkColour('favourites')}
            >
              Favourites
            </Button>
          </Flex>
          <Group>
            <Text>{email}</Text>
            <Button variant='default' size='sm' onClick={() => logout()}>
              <MdLogout />
            </Button>
            <Button
              variant='default'
              size='sm'
              onClick={() => toggleColorScheme()}
            >
              {computedColorScheme === 'dark' ? <FaSun /> : <FaMoon />}
            </Button>
          </Group>
        </Flex>
      </AppShell.Header>
      <AppShell.Main>
        <SearchContextProvider>
          <Outlet />
        </SearchContextProvider>
      </AppShell.Main>
    </AppShell>
  );
}
