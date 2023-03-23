// Section.js
import React, {forwardRef} from "react";
import styled from "styled-components";

const SectionContainer = styled.div`
  margin-bottom: 30px;
  margin-right: 30vw;
`;

const SectionTitle = styled.h2`
  margin-bottom: 15px;
  font-size: 26px;
  cursor: default;
  font-weight: 300;
  color: #48fdce;
`;

const SectionContent = styled.div``;

const Section = forwardRef(({title, children}, ref) => {
    return (
        <SectionContainer ref={ref}>
            <SectionTitle>{title}</SectionTitle>
            <SectionContent>{children}
            </SectionContent>
        </SectionContainer>
    );
});
Section.displayName = "Section"
export default Section;
