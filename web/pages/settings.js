import React, {useRef} from "react";
import Layout from "../Layouts/basicLayout"
import styled from 'styled-components'
import Sidebar from "../components/settings/Sidebar";
import Section from "../components/settings/Section";

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const Content = styled.div`
  margin-left: 200px;
  flex: 1;
  padding: 2rem;
  overflow-y: scroll;
`;

const Settings = () => {
    const userInfoRef = useRef(null);
    const extensionKeyRef = useRef(null);

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <Container>
            <Sidebar
                onUserInfoClick={() => scrollToSection(userInfoRef)}
                onExtensionKeyClick={() => scrollToSection(extensionKeyRef)}
            />
            <Content>
                <Section
                    ref={userInfoRef}
                    title="User Information"
                    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rhoncus commodo neque, non ultricies velit ullamcorper non."
                />
                <Section
                    ref={extensionKeyRef}
                    title="Extension Key"
                    content="Phasellus et libero vel enim tincidunt imperdiet. Vivamus et ante facilisis, commodo ligula id, semper nisl."
                />
            </Content>
        </Container>
    );
};

Settings.PageLayout = Layout;

export default Settings;