import {ChakraProvider} from '@chakra-ui/react'
import {ThemeProvider} from 'styled-components'
import GlobalStyle from '../components/globalstyles'
import {Open_Sans, Buenard} from '@next/font/google'
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { DataTetherProvider } from '../components/DataTetherProvider';

const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open' },)
const buenard = Buenard({ weight: "700", variable: '--font-b', subsets: ['latin'], })
const openSans = Open_Sans({subsets: ['latin'], variable: '--font-open'},)
const buenard = Buenard({weight: "700", variable: '--font-b', subsets: ['latin'],})

import '/styles/globals.css'
import {SessionProvider} from "next-auth/react"

const theme = {
    colors: {
        primary: '#fbfbff',
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
                    <DataTetherProvider>
                        <GlobalStyle />
                        <main className={`${openSans.className} ${openSans.variable} font-sans`}>
                            <style jsx global>{`
                            :root {
                                --font-b: ${buenard.style.fontFamily};
                            }
                            `}</style>
                            {Component.PageLayout ? (
                                <Component.PageLayout>
                                    <Component {...pageProps} />
                                </Component.PageLayout>
                            ) : (
                                <Component {...pageProps} />
                            )}
                        </main>
                    </DataTetherProvider>
                </SessionProvider>
            </ThemeProvider>
        </ChakraProvider>
    )
}

export default MyApp