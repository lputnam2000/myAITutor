import {ChakraProvider} from '@chakra-ui/react'
import {ThemeProvider} from 'styled-components'
import GlobalStyle from '../components/globalstyles'

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
                <Component {...pageProps} />
            </ThemeProvider>
        </ChakraProvider>
    )
}

export default MyApp