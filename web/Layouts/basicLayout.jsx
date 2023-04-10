import Navbar from "../components/UIComponents/Navbar"
import styled from 'styled-components'
import FeedbackOverlay from "../components/FeedbackOverlay";
import WebsocketContextProvider from "../components/WebsocketContext";
import {NextSeo} from "next-seo";
import React from "react";


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
            <NextSeo
                title="Chimpbase"
                description="Chimpbase is a game-changing information discovery platform, leveraging advanced AI technologies such as semantic search and chatGPT to deliver accurate, efficient and comprehensive insights from various sources including videos, documents, and websites. With AI-powered summarization and intuitive interfaces, Chimpbase is the ultimate solution for users seeking to deepen their understanding and knowledge."
            />
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
