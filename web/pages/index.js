import Head from 'next/head'
import styled from 'styled-components'
import HomeNavbar from "/components/HomeNavbar";
import HowItWorks from "/components/index/HowItWorks";
import Footer from '/components/UIComponents/Footer';
import HeadLine from "/components/index/HeadLine";


const Container = styled.div`
  //height: 100%;
  display: flex;
  padding: 1rem 1rem 3rem 1rem;
  flex-direction: column;
  align-items: center;
  background-color: #0A0A0A;
  background-image: radial-gradient(circle at left 0% bottom 90%, rgba(116, 66, 200, 0.2) 10%, transparent 50%),
  radial-gradient(circle at right 10% bottom 10%, rgba(116, 66, 200, 0.3) 10%, transparent 50%);
  radial-gradient(circle at right 50% bottom 50%, rgba(116, 66, 200, 0.3) 10%, transparent 50%);

  //justify-content: center;
`


const Main = styled.main`
  min-height: 100vh;
  background-color: #1c2025;
  color: #fff;
`

const TryNowButton = styled.a`
  margin: 3rem;
  background-color: #FFE135;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 15px 30px;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  color: #3C2F23;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.5);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 600px) {
    padding: 10px 20px;
    font-size: 1.2rem;
  }
`;

const InvisibleH1 = styled.h1`
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);
  overflow: hidden;
  white-space: nowrap;
`;


export default function Home({}) {


    return (
        <>
            <Head>
                <title>ChimpBase</title>
                <meta name="description"
                      content="Chimpbase is revolutionizing the way people consume information. Our innovative software extracts key details from large pieces of text, video and PDFs to create smart notes that help users understand and retain information quickly and easily. Join the waitlist today and join the Chimp Squad to simplify your information overload "/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta name="keywords"
                      content="ChIPBase v2.0, ChIPBase, AI Summarizer, AI Summary, Chimpbase, Summarizer, Summary, Semantic Search, PDF Summarizer, Video Summarizer, AI PDF Summarizer, AI Video Summarizer"/>
                <link rel="icon" href="/svg/bananas.svg"/>
            </Head>
            <Main>
                <HomeNavbar/>
                <Container>
                    <InvisibleH1>ChIPBase</InvisibleH1>
                    <HeadLine/>
                    {/*<HowItWorks/>*/}
                    {/*<TryNowButton href={'/home'}>No cost. No risk. Try it now.</TryNowButton>*/}
                </Container>
                <Footer/>
            </Main>
        </>
    )
}
