import {ChakraProvider} from '@chakra-ui/react'
import {ThemeProvider} from 'styled-components'
import '/styles/globals.css'
import { SessionProvider } from "next-auth/react"

const theme = {
    colors: {
        primary: '#111',
        secondary: '#0070f3',
    },
}

function MyApp({
    Component,
    pageProps: { session, ...pageProps },
  }) {


    return (
        <ChakraProvider>
            <ThemeProvider theme={theme}>
                <SessionProvider session={session}>
                    <Component {...pageProps} />
                </SessionProvider>
            </ThemeProvider>
        </ChakraProvider>
    )
}

export default MyApp