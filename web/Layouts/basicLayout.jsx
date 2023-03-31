import Navbar from "../components/UIComponents/Navbar"
import {useRouter} from 'next/router';
import styled from 'styled-components'
import FeedbackOverlay from "../components/FeedbackOverlay";


const Main = styled.main`
  background-color: #1c2025;
  color: #d9f6e8;
  overflow-y: auto; /* Adds a scrollbar if content overflows vertically */
  position: relative;
  min-height: calc(100vh - 50px); /* Sets a minimum height of 100% viewport height */
  @media (max-width: 600px) {
    //height: 75px;
    min-height: calc(100vh - 75px);
  }
  @media (max-width: 400px) {
    min-height: calc(100vh - 60px);
  }
`

export default function BasicLayout({children}) {
    const router = useRouter();
    return (
        <>
            <Navbar/>
            <Main>
                {children}
                <FeedbackOverlay/>
            </Main>
        </>
    )
}
