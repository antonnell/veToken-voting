import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useRouter } from 'next/router';

import '../styles/global.css'

import lightTheme from '../theme/light';
import darkTheme from '../theme/dark';

import Configure from './configure';

import stores from '../stores/index.js';

import { CONFIGURE, CONFIGURE_RETURNED } from '../stores/constants';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const [themeConfig, setThemeConfig] = useState(lightTheme);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const changeTheme = (dark) => {
    setThemeConfig(dark ? darkTheme : lightTheme);
    localStorage.setItem('yearn.finance-dark-mode', dark ? 'dark' : 'light');
  };

  const configureReturned = () => {
    setConfigured(true);
  };

  useEffect(function () {
    const localStorageDarkMode = window.localStorage.getItem('yearn.finance-dark-mode');
    changeTheme(localStorageDarkMode ? localStorageDarkMode === 'dark' : false);
  }, []);

  useEffect(function () {
    stores.emitter.on(CONFIGURE_RETURNED, configureReturned);
    stores.dispatcher.dispatch({ type: CONFIGURE });

    return () => {
      stores.emitter.removeListener(CONFIGURE_RETURNED, configureReturned);
    };
  }, []);

  const validateConfigured = () => {
    return true
    return configured
  };

  return (
    <React.Fragment>
      <Head>
        <title>veToken</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={themeConfig}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {validateConfigured() && <Component {...pageProps} changeTheme={changeTheme} />}
        {!validateConfigured() && <Configure {...pageProps} />}
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
