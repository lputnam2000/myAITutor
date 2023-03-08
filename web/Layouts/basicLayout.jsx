import Navbar from "../components/UIComponents/Navbar"
import { useRouter } from 'next/router';
import styled from 'styled-components'
import BackButton from '../components/UIComponents/BackButton'

const StyledBack = styled.div`
  margin: 4px 8px 4px 8px;
`

export default function BasicLayout({ children }) {
  const router = useRouter();
  return (
    <>
      <Navbar />
      <StyledBack>
        <BackButton/>
      </StyledBack>
      <main>{children}</main>
    </>
  )
}
