import styled from 'styled-components';
import Link from 'next/link'


const FooterContainer = styled.footer`
  width: 100%;
  background-color: #000000;
  padding: 1.5rem;
  text-align: center;
`;

const FooterLinks = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  list-style: none;
  margin: 0 0 0 10px;
  padding: 0;
`;

const FooterLink = styled.li`
  margin: 0 1rem;
  position: relative;

  &:before,
  &:after {
    content: '';
    position: absolute;
    width: calc(100% + 10px);
    height: calc(100% + 10px);
    top: -5px;
    left: -5px;
    z-index: -1;
    filter: blur(8px);
    opacity: 0.4;
    transition: all 0.3s ease-in-out;
  }

  &:before {
    background-color: #bb6bd9;
    transform: translate(-4px, -4px);
  }

  &:after {
    background-color: #e068e1;
    transform: translate(4px, 4px);
  }

  &:hover {
    &:before,
    &:after {
      transform: translate(0, 0);
      opacity: 0.8;
    }
  }
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-weight: bold;
`

const Trademark = styled.div`
  margin: 1rem 0 0 0;
  display: block;
  font-size: .75rem;
`

const Footer = () => {
    return (
        <FooterContainer>
            <FooterLinks>
                <FooterLink>
                    <StyledLink href="https://twitter.com/chimpbase">Twitter</StyledLink>
                </FooterLink>
                <FooterLink>
                    <StyledLink href="https://blog.chimpbase.com">Blog with tutorials</StyledLink>
                </FooterLink>
                <FooterLink>
                    <StyledLink href="/tos">Terms of Service</StyledLink>
                </FooterLink>
            </FooterLinks>
            <Trademark>&copy; Chimpbase.com - All rights reserved.</Trademark>
        </FooterContainer>
    );
};

export default Footer;
