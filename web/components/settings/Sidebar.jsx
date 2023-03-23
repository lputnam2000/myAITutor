// Sidebar.js
import React from "react";
import styled from "styled-components";

const SidebarContainer = styled.div`
  position: fixed;
  width: 300px;
  height: 100%;
  padding: 20px 1rem 1rem 1rem;
`;

const SidebarItem = styled.button`
  background: none;
  border: none;
  padding: 10px 10px 0px 0px;
  text-align: right;
  font-size: 16px;

  &:hover {
    color: #f69876;
  }

  font-weight: 300;
  width: 100%;
  cursor: pointer;
`;
const SidebarHeading = styled.h3`
  background: none;
  border: none;
  text-align: right;
  font-weight: 600;
  font-size: 26px;
  cursor: default;
  color: #48fdce;
  width: 100%;
  padding-right: 10px;
`;

const Sidebar = ({onUserInfoClick, onExtensionKeyClick}) => {
    return (
        <SidebarContainer>
            <SidebarHeading>Settings</SidebarHeading>
            <SidebarItem onClick={onUserInfoClick}>User Information</SidebarItem>
            <SidebarItem onClick={onExtensionKeyClick}>Extension Key</SidebarItem>
        </SidebarContainer>
    );
};

export default Sidebar;
