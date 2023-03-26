import Head from 'next/head'
import styled from 'styled-components'

const Main = styled.main`
  min-height: 100vh;
`


export default function Home() {

    return (
        <>
            <Head>
                <title>ChimpBase</title>
                <meta name="description"
                      content="Chimpbase is revolutionizing the way people consume information. Our innovative software extracts key details from large pieces of text, video and PDFs to create smart notes that help users understand and retain information quickly and easily. Join the waitlist today and join the Chimp Squad to simplify your information overload "/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Main>
                Terms of Service
            </Main>
        </>
    )
}
