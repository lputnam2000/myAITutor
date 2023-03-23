import Navbar from "../components/UIComponents/Navbar"
import {useRouter} from 'next/router';
import styled from 'styled-components'

const Main = styled.main`
    background-color: black;
`

export default function BasicLayout({children}) {
    const router = useRouter();
    return (
        <>
            <Navbar/>
            <Main>{children}</Main>
        </>
    )
}
