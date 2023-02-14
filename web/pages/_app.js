import {ChakraProvider} from '@chakra-ui/react'
import {ThemeProvider} from 'styled-components'
import GlobalStyle from '../components/globalstyles'
import {Open_Sans, Buenard} from '@next/font/google'

const openSans = Open_Sans({subsets: ['latin'], variable: '--font-open'},)
const buenard = Buenard({weight: "700", variable: '--font-b', subsets:['latin'], })

import '/styles/globals.css'
import {SessionProvider} from "next-auth/react"

const theme = {
    colors: {
        primary: '#FBFBFF',
        secondary: '#000000',
        green: '#39ff14',
        blue: '#89CFF0',
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
                        <style jsx global>{`
                            :root {
                              --font-b: ${buenard.style.fontFamily};
                            }
                          `}</style>
                        <Component {...pageProps} />
                    </main>
                </SessionProvider>
            </ThemeProvider>
        </ChakraProvider>
    )
}

export default MyApp