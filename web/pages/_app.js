import {ChakraProvider} from '@chakra-ui/react'
import {ThemeProvider} from 'styled-components'
import GlobalStyle from '../components/globalstyles'
import {Open_Sans, Domine} from '@next/font/google'

const openSans = Open_Sans({subsets: ['latin'], variable: '--font-open'},)

const theme = {
    colors: {
        primary: '#111',
        secondary: '#0070f3',
    },
}


function MyApp({Component, pageProps}) {


    return (
        <ChakraProvider>
            <ThemeProvider theme={theme}>
                <GlobalStyle/>
                <main className={`${openSans.className} ${openSans.variable} font-sans`}>
                    <Component {...pageProps} />
                </main>
            </ThemeProvider>
        </ChakraProvider>
    )
}

export default MyApp