import React, { ReactNode, ReactElement } from 'react';
import { Provider } from 'react-redux'
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import type { NextPage } from 'next'
import { SWRConfig } from 'swr';
import { GlobalContextProvider } from '../src/context/globalContext';
import store from '../src/store/store';
import axios from 'axios';
const initialData = { todos: [], completedTodos: [] }

const clientSideEmotionCache = createEmotionCache();



export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
  emotionCache?: EmotionCache;

}

export default function MyApp(props: AppPropsWithLayout) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page)

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Provider store={store}>
        <SWRConfig value={{
          fallback: initialData,
          // refreshInterval: 10000,
          fetcher: (url: string) => axios.get(url).then(res => res.data),
          onErrorRetry: (error, _1, _2, revalidate, { retryCount }) => {
            if (error.response.status === 404 || error.response.status === 401) return

            if (retryCount >= 5) return

            setTimeout(() => revalidate({ retryCount }), 5000)
          }
        }}>

          <GlobalContextProvider >
            <ThemeProvider theme={theme}>
              <CssBaseline />

              {getLayout(<Component {...pageProps} />)}
            </ThemeProvider>
          </GlobalContextProvider>
        </SWRConfig>
      </Provider>


    </CacheProvider>
  );
}
