import React from 'react';
import styled from "styled-components";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";

const Container = styled.div`
  //flex: 1;
  width: 40vw;

  margin-top: 10px;
  margin-right: 20px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;

`

function Summary(props) {
    return (
        <Container>
            <Tabs variant='enclosed' isFitted>
                <TabList>
                    <Tab _selected={{color: 'black', bg: '#FFFF99'}}>Summary</Tab>
                    <Tab _selected={{color: 'black', bg: '#FFFF99'}}>Search</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <p>Summary</p>
                    </TabPanel>
                    <TabPanel>
                        <p>Search</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    );
}

export default Summary;