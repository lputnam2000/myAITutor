import Navbar from "../components/UIComponents/Navbar"
import {useRouter} from 'next/router';
import styled from 'styled-components'
import FeedbackOverlay from "../components/FeedbackOverlay";


const Main = styled.main`
  background-color: #1c2025;
  color: #d9f6e8;
  height: 100%;
  position: relative;
`

export default function BasicLayout({children}) {
    const router = useRouter();
    return (
        <>
            <Navbar/>
            <Main>{children}
                <FeedbackOverlay/>
            </Main>

        </>
    )
}
