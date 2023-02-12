import {ChakraProvider} from '@chakra-ui/react'
import {ThemeProvider} from 'styled-components'
import GlobalStyle from '../components/globalstyles'
import {Open_Sans, Domine} from '@next/font/google'

const openSans = Open_Sans({subsets: ['latin'], variable: '--font-open'},)
import '/styles/globals.css'
import {SessionProvider} from "next-auth/react"

const theme = {
    colors: {
        primary: '#FBFBFF',
        secondary: '#000000',
        green: '#39ff14',
        blue: '#1FDDFF',
        pink: '#FF1f8f'
    },
}

function MyApp({
                   Component,
                   pageProps: {session, ...pageProps},
               }) {


    return (
        <ChakraProvider>
            <ThemeProvider theme={theme}>
                <SessionProvider session={session}>
                    <GlobalStyle/>
                    <main className={`${openSans.className} ${openSans.variable} font-sans`}>
                        <Component {...pageProps} />
                    </main>
                </SessionProvider>
            </ThemeProvider>
        </ChakraProvider>
    )
}

export default MyApp