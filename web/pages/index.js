import Head from 'next/head'
import styled, {keyframes} from 'styled-components'
import HomeNavbar from "../components/HomeNavbar";
// import {FormControl, FormHelperText, FormLabel, Input} from "@chakra-ui/react";
import { useState} from "react";
import axios from "axios";
import dynamic from 'next/dynamic';
const DemoPDFSummary = dynamic(() => import("../components/DemoPDFSummary"), { ssr: false });
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';


const Container = styled.div`
  //height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

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
  background-color: ${({isDisabled, theme}) => isDisabled ? 'gray': theme.colors.secondary};
  color: white;
  display: inline-block;
  padding: 10px;
  cursor: ${({isDisabled, theme}) => isDisabled ? 'not-allowed': 'pointer'};
  font-weight: 500;

  &:hover {
    background-color: ${({isDisabled, theme}) => isDisabled ? 'gray': theme.colors.blue};
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


export async function getServerSideProps() {
    async function  getDemoPdf() {
        let params = {'key': 'f36f637f-1ee6-45dd-ba7b-9b989b5294a5'}
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/get_demo_pdf`, { params: params });
            return res.data;
        } catch (err) {
            console.log(err);
            return null; // Return null in case of an error
        }
    }

    const demoPDFData = await getDemoPdf();
    console.log(demoPDFData)
    return {
        props: {
            demoPDFData,
        },
    };
}

export default function Home({demoPDFData}) {
    const [email, setEmail] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [isDisabled, setIsDisabled] = useState(false)
    const [joinedWaitlist, setJoinedWaitlist] = useState(false)
    const session = useSession();
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
                    <Banner>Please view on a bigger screen for the best experience</Banner>
                    <HeadlineContainer>
                        <Text id="text">Don&apos;t Get Lost in the Details: Use <Underline
                            color={'#000'}>ChimpBase</Underline> to <Underline
                            color={'#000'}>Simplify&nbsp;</Underline>
                            and <Underline color={'#000'}>Conquer</Underline></Text>
                    </HeadlineContainer>
                    <DemoPDFSummary demoPDFData={demoPDFData}/>
                    {/*<WaitingListCard id={'waiting-list'}>*/}
                    {/*    <JoinWaitingListHeading>*/}
                    {/*        Join the Waiting list*/}
                    {/*    </JoinWaitingListHeading>*/}
                    {/*    <InfoText>*/}
                    {/*        Say goodbye to information overload, hello to effortless understanding!*/}
                    {/*    </InfoText>*/}
                    {/*    <FormControl>*/}
                    {/*        <FormLabel>Email address</FormLabel>*/}
                    {/*        <Input isInvalid={emailErrorMessage !== ''} value={email}*/}
                    {/*               onChange={(e) => setEmail(e.target.value)} borderColor={'black'*/}
                    {/*        } focusBorderColor={'black'}*/}
                    {/*               type='email'/>*/}
                    {/*        {*/}
                    {/*            joinedWaitlist ?*/}
                    {/*            <FormHelperText>Thanks for joining the waitlist! We&apos;ll keep you updated via email. Be sure to check your inbox regularly.</FormHelperText>*/}
                    {/*            : <FormHelperText>We&apos;ll never share your email.</FormHelperText>*/}
                    {/*        }*/}
                    {/*    </FormControl>*/}
                    {/*    <Submit isDisabled={isDisabled} onClick={submitEntry}>*/}
                    {/*        Join the Chimp Squad*/}
                    {/*    </Submit>*/}
                    {/*</WaitingListCard>*/}
                </Container>
            </Main>
        </>
    )
}
