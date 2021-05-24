import React, { useEffect } from 'react'
import { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { ChakraProvider } from '@chakra-ui/react'

import GlobalStyle from '../styles/global'
import StyledTheme, { theme } from '../styles/theme'
import Store from '../util/store'
import { v4 } from 'uuid'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    Store.get('game@fingerprint', v4())
  }, [])

  return (
    <ThemeProvider theme={StyledTheme}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
        <GlobalStyle />
      </ChakraProvider>
    </ThemeProvider>
  )
}

export default MyApp
