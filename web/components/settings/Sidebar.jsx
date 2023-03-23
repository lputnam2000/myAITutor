// Sidebar.js
import React from "react";
import styled from "styled-components";

const SidebarContainer = styled.div`
  position: fixed;
  width: 200px;
  height: 100%;
  background-color: #f8f8f8;
  padding: 1rem;
`;

const SidebarItem = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  text-align: left;
  width: 100%;
  cursor: pointer;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const Sidebar = ({ onUserInfoClick, onExtensionKeyClick }) => {
    return (
        <SidebarContainer>
            <SidebarItem onClick={onUserInfoClick}>User Information</SidebarItem>
            <SidebarItem onClick={onExtensionKeyClick}>Extension Key</SidebarItem>
        </SidebarContainer>
    );
};

export default Sidebar;
