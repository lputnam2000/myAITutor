import Head from 'next/head'
import styled from 'styled-components'
import HomeNavbar from "../components/HomeNavbar";
import {FormControl, FormHelperText, FormLabel, Input} from "@chakra-ui/react";
import {useState} from "react";
import axios from "axios";


const Container = styled.div`
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const WaitingListCard = styled.div`
  margin-top: 20px;
  border-radius: 3px;
  width: 400px;
    //background-color: ${(props) => props.theme.colors.blue};
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
const JoinWaitingListHeading = styled.div`
  font-family: var(--font-b);
  font-size: 25px;
`
const InfoText = styled.div`
  margin-bottom: 10px;
`

const Submit = styled.div`
  margin-top: 15px;
  background-color: black;
  color: ${({theme}) => theme.colors.primary};
  display: inline-block;
  padding: 10px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: ${({theme}) => theme.colors.blue};
    color: ${({theme}) => theme.colors.secondary};
  }
`

const Main = styled.main`
  height: 100vh;
`


export default function Home() {
    const [email, setEmail] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const submitEntry = () => {
        const emailRegex =
            /^(?=[a-z0-9@._%+-]{6,254}$)[a-z0-9._%+-]{1,64}@(?:[a-z0-9-]{1,63}\.){1,8}[a-z]{2,63}$/;
        if (!emailRegex.test(email.toLowerCase())) {
            setEmailErrorMessage("invalid email");
            return;
        } else {
            setEmailErrorMessage('')
        }
        axios
            .post("/api/waitingList", {
                email,
            })
            .then((res) => {
                console.log(res);
                setJoinedWaitlist(true)
            });
    }


    return (
        <>
            <Head>
                <title>Chimpbase</title>
                <meta name="description"
                      content="Chimpbase is revolutionizing the way people consume information. Our innovative software extracts key details from large pieces of text, video and PDFs to create smart notes that help users understand and retain information quickly and easily. Join the waitlist today and join the Chimp Squad to simplify your information overload "/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Main>
                <HomeNavbar/>
                <Container>
                    <WaitingListCard>
                        <JoinWaitingListHeading>
                            Join the Waiting list
                        </JoinWaitingListHeading>
                        <InfoText>
                            Say goodbye to information overload, hello to effortless understanding!
                        </InfoText>
                        <FormControl>
                            <FormLabel>Email address</FormLabel>
                            <Input isInvalid={emailErrorMessage !== ''} value={email}
                                   onChange={(e) => setEmail(e.target.value)} borderColor={'black'
                            } focusBorderColor={'black'}
                                   type='email'/>
                            <FormHelperText>We&apos;ll never share your email.</FormHelperText>
                        </FormControl>
                        <Submit onClick={submitEntry}>
                            Join the Chimp Squad
                        </Submit>
                    </WaitingListCard>

                </Container>
            </Main>
        </>
    )
}
