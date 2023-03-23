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
`;

const Content = styled.div`
  margin-left: 300px;
  flex: 1;
  padding: 20px 1rem 1rem 1rem;
`;

const Settings = () => {
    const userInfoRef = useRef(null);
    const extensionKeyRef = useRef(null);

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({behavior: "smooth", block: "start"});
    };

    return (
        <Container>
            <SettingsContextProvider>
                <Sidebar
                    onUserInfoClick={() => scrollToSection(userInfoRef)}
                    onExtensionKeyClick={() => scrollToSection(extensionKeyRef)}
                />
                <Content>
                    <Section
                        ref={userInfoRef}
                        title="User Information"
                    ><UserInformation/></Section>
                    <Section
                        ref={extensionKeyRef}
                        title="Extension Key"
                        content="Phasellus et libero vel enim tincidunt imperdiet. Vivamus et ante facilisis, commodo ligula id, semper nisl."
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