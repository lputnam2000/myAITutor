import Navbar from "../components/UIComponents/Navbar"
import styled from 'styled-components'
import FeedbackOverlay from "../components/FeedbackOverlay";
import WebsocketContextProvider from "../components/WebsocketContext";


const Main = styled.main`
  background-color: #1c2025;
  color: #d9f6e8;
  overflow-y: auto;
  position: relative;
  min-height: calc(100vh - 50px);
  @media (max-width: 600px) {
    min-height: calc(100vh - 75px);
  }
  @media (max-width: 400px) {
    min-height: calc(100vh - 60px);
  }
  display: flex;
  flex-direction: column;
`

export default function BasicLayout({children}) {
    return (
        <>
            <Navbar/>
            <Main>
                <WebsocketContextProvider>
                    {children}
                    <FeedbackOverlay/>
                </WebsocketContextProvider>

            </Main>
        </>
    )
}
