import Head from 'next/head'
import styled, {keyframes} from 'styled-components'
import HomeNavbar from "../components/HomeNavbar";
import {useState} from "react";
import axios from "axios";
import dynamic from 'next/dynamic';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import HowItWorks from "../components/index/HowItWorks";

const PageWrapper = styled.div`
  position: relative;
  background-color: #333333;
  background-image: radial-gradient(circle at 20% 50%, #7442c8 10%, transparent 20%),
                    radial-gradient(circle at 80% 30%, #7442c8 10%, transparent 20%),
                    radial-gradient(circle at 50% 70%, #7442c8 10%, transparent 20%),
                    radial-gradient(circle at 10% 90%, #7442c8 10%, transparent 20%);
  background-size: 200px 200px;
  background-repeat: no-repeat;
  height: 100%;
  min-height: 100vh;
`;
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
const WaitingListCard = styled.div`
  margin-top: 20px;
  margin-bottom: 40px;
  border-radius: 3px;
  width: 400px;
  background-color: ${(props) => props.theme.colors.primary};
  border: ${(props) => props.theme.colors.secondary} 2px solid;

  &:hover {
    box-shadow: 5px 5px 0px #000000;
    transition: box-shadow 0.1s ease-in-out;
  }

  padding: 30px;
  @media (max-width: 375px) {
    width: 300px;
  }
`
const JoinWaitingListHeading = styled.h2`
  font-family: var(--font-b);
  font-size: 25px;
`
const InfoText = styled.div`
  margin-bottom: 10px;
`
const Submit = styled.div`
  margin-top: 15px;
  background-color: ${({isDisabled, theme}) => isDisabled ? 'gray' : theme.colors.secondary};
  color: white;
  display: inline-block;
  padding: 10px;
  cursor: ${({isDisabled, theme}) => isDisabled ? 'not-allowed' : 'pointer'};
  font-weight: 500;

  &:hover {
    background-color: ${({isDisabled, theme}) => isDisabled ? 'gray' : theme.colors.blue};
    color: ${({theme}) => theme.colors.secondary};
  }
`
const gradientKeyframes = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`
const Main = styled.main`
  min-height: 100vh;
  background-color: #1c2025;
  color: #fff;
`
const HeadlineContainer = styled.div`
  text-align: center;

  font-family: var(--font-b);

`
const Text = styled.h1`
  vertical-align: middle;
  font-family: var(--font-b);

  @media (min-width: 550px) {
    font-size: 40px;
  }
  @media (min-width: 900px) {
    font-size: 50px;
  }
  font-size: 24px;
`
const Underline = styled.span`
  position: relative;
  text-decoration: underline;
`
const Banner = styled.div`
  background-color: black;
  color: white;
  display: none;
  width: 100%;
  padding: 10px 15px;
  @media (max-width: 500px) {
    display: block;
  }
`
const TryNowButton = styled.button`
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
  box-shadow: 0px 2px 5px rgba(0,0,0,0.3);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  color:#3C2F23;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 5px 10px rgba(0,0,0,0.5);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 2px 5px rgba(0,0,0,0.3);
  }

  @media (max-width: 600px) {
    padding: 10px 20px;
    font-size: 1.2rem;
  }
`;
export default function Home({}) {
    const [email, setEmail] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [isDisabled, setIsDisabled] = useState(false)
    const [joinedWaitlist, setJoinedWaitlist] = useState(false)
    const {data: session} = useSession();
    const router = useRouter();

    const submitEntry = () => {
        const emailRegex =
            /^(?=[a-z0-9@._%+-]{6,254}$)[a-z0-9._%+-]{1,64}@(?:[a-z0-9-]{1,63}\.){1,8}[a-z]{2,63}$/;
        if (!emailRegex.test(email.toLowerCase())) {
            setEmailErrorMessage("invalid email");
            return;
        } else {
            setEmailErrorMessage('')
        }
        setIsDisabled(true)
        axios
            .post("/api/waitingList", {
                email,
            })
            .then((res) => {
                // console.log(res);
                setIsDisabled(false)
                setJoinedWaitlist(true)
            });
    }


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
                <HomeNavbar/>
                <Container>
                    <HowItWorks/>
                    <TryNowButton onClick={()=>{router.push("/home")}}>No cost. No risk. Try it now.</TryNowButton>
                </Container>
            </Main>
        </>
    )
}
