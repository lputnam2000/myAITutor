import React, {useRef} from "react";
import Layout from "../Layouts/basicLayout"
import styled from 'styled-components'
import Sidebar from "../components/settings/Sidebar";
import Section from "../components/settings/Section";
import UserInformation from "../components/settings/sections/UserInformation";
import ExtensionInformation from "../components/settings/sections/ExtensionInformation";
import SettingsContextProvider from "../components/settings/context";

const Container = styled.div`
  display: flex;
  min-height: 94.4vh;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Content = styled.div`
  margin-left: 300px;
  flex: 1;
  padding: 20px 1rem 1rem 1rem;
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const SidebarWrapper = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`

const Settings = () => {
    const userInfoRef = useRef(null);
    const extensionKeyRef = useRef(null);

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({behavior: "smooth", block: "start"});
    };

    return (
        <Container>
            <SettingsContextProvider>
                <SidebarWrapper>
                    <Sidebar
                    onUserInfoClick={() => scrollToSection(userInfoRef)}
                    onExtensionKeyClick={() => scrollToSection(extensionKeyRef)}/>
                </SidebarWrapper>
                <Content>
                    <Section
                        ref={userInfoRef}
                        title="User Information"
                    ><UserInformation/></Section>
                    <Section
                        ref={extensionKeyRef}
                        title="Extension Key"
                    >
                        <ExtensionInformation/>
                    </Section>
                </Content>
            </SettingsContextProvider>
        </Container>
    );
};

Settings.PageLayout = Layout;

export default Settings;