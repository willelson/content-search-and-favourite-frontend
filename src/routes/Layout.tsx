import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Drawer,
  Flex,
  Group,
  Stack,
  Text,
  Tooltip,
  useMantineColorScheme,
  useComputedColorScheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FaSun, FaMoon } from 'react-icons/fa';
import { MdLogout, MdOutlineExplore } from 'react-icons/md';

import {
  getUserCredentials,
  removeUserCredentials
} from '../helpers/tokenManager';
import { SearchContextProvider } from '../context/searchContext';

type MobileHeader = {
  hiddenFrom?: string;
  opened: boolean;
  toggle: () => void;
};

function MobileHeader({ hiddenFrom = 'sm', opened, toggle }: MobileHeader) {
  return (
    <Flex
      hiddenFrom={hiddenFrom}
      justify='space-between'
      align='center'
      style={{ padding: '0px 30px', height: '100%' }}
    >
      <Flex>
        <Text size='lg' mr={8}>
          Pixabay
        </Text>
        <MdOutlineExplore size={26} />
      </Flex>
      <Burger opened={opened} onClick={toggle} size='sm' />
    </Flex>
  );
}

export default function Layout() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [opened, { toggle, close }] = useDisclosure();

  const location = useLocation();

  useEffect(() => {
    const credentials = getUserCredentials();
    if (credentials.email.length > 0) {
      setEmail(() => credentials.email);
    }
  }, []);

  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');
  const colorSchemeToggleText = `${
    computedColorScheme === 'dark' ? 'Light' : 'Dark'
  } mode`;

  const toggleColorScheme = () =>
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');

  const getLinkColour = (route: string): string =>
    location.pathname.includes(route) ? '' : 'gray';

  const logout = () => {
    removeUserCredentials();
    navigate('login');
  };

  return (
    <>
      <AppShell header={{ height: 60 }} padding='md'>
        <AppShell.Header>
          <MobileHeader opened={opened} toggle={toggle} />
          <Flex
            justify='space-between'
            align='center'
            style={{ padding: '0px 30px', height: '100%' }}
            visibleFrom='sm'
          >
            <Flex align='center'>
              <Text size='lg' mr={8}>
                Pixabay
              </Text>
              <MdOutlineExplore size={26} />
            </Flex>

            <Group>
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
            </Group>

            <Group>
              <Tooltip label={email} withArrow>
                <Avatar
                  src={null}
                  alt={email}
                  color='red'
                  style={{ textTransform: 'capitalize' }}
                  title={undefined}
                >
                  {email[0]}
                </Avatar>
              </Tooltip>
              <Tooltip label='Logout' withArrow>
                <Button variant='default' size='sm' onClick={logout}>
                  <MdLogout />
                </Button>
              </Tooltip>
              <Tooltip label={colorSchemeToggleText} withArrow>
                <Button variant='default' size='sm' onClick={toggleColorScheme}>
                  {computedColorScheme === 'dark' ? <FaSun /> : <FaMoon />}
                </Button>
              </Tooltip>
            </Group>
          </Flex>
        </AppShell.Header>
        <AppShell.Main>
          <SearchContextProvider>
            <Outlet />
          </SearchContextProvider>
        </AppShell.Main>
        <Drawer opened={opened} onClose={close} title='Menu' position='top'>
          <Stack>
            <Button
              variant='subtle'
              size='sm'
              onClick={() => {
                navigate('/search');
                close();
              }}
              color={getLinkColour('search')}
            >
              Search
            </Button>
            <Button
              variant='subtle'
              size='sm'
              onClick={() => {
                navigate('/favourites');
                close();
              }}
              color={getLinkColour('favourites')}
            >
              Favourites
            </Button>
            <Group align='center' justify='center'>
              <Avatar
                src={null}
                alt={email}
                color='red'
                style={{ textTransform: 'capitalize' }}
              >
                {email[0]}
              </Avatar>

              <Button variant='default' size='sm' onClick={logout}>
                <MdLogout />
              </Button>
              <Button variant='default' size='sm' onClick={toggleColorScheme}>
                {computedColorScheme === 'dark' ? <FaSun /> : <FaMoon />}
              </Button>
            </Group>
          </Stack>
        </Drawer>
      </AppShell>
    </>
  );
}
