import styled from 'styled-components';
import Layout from "../Layouts/basicLayout"
import React, { useEffect, useState } from "react";

const PageContainer = styled.div`
  background-color: #f8f8f8;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Button = styled.button`
  background-color: #f7d1ba;
  color: #fff;
  font-size: 1.2rem;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #d4a7a4;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: none;
  }
`;

const StyledApiKey = styled.div`
  width: 100%;
  text-align: center;
`

function ApiKeyPage() {
    const [apiKeyText, setApiKeyText] = useState();

    const refreshApiKey = async () => {
        const response = await fetch('/api/user/get_api_token');
        const data = await response.json();
        setApiKeyText(data.apikey);
    }

    return (
        <PageContainer>
            <StyledApiKey>{apiKeyText ? "Your API Key: " + apiKeyText : ""}</StyledApiKey>
            <Button id="generate-api-key-button" onClick={refreshApiKey}>Generate API Key</Button>
        </PageContainer>
    );
}
ApiKeyPage.PageLayout = Layout;

export default ApiKeyPage;