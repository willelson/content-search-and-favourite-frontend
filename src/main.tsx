import React from 'react';
import ReactDOM from 'react-dom/client';
import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({});

import App from './App';

const findSystemColorScheme = () => {
  const systemSettingDark = window.matchMedia('(prefers-color-scheme: dark)');
  if (systemSettingDark?.matches) {
    return 'dark';
  }

  return 'light';
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MantineProvider theme={theme} defaultColorScheme={findSystemColorScheme()}>
    <React.StrictMode>
      <App></App>
    </React.StrictMode>
  </MantineProvider>
);
