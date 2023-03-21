import Navbar from "../components/UIComponents/Navbar"
import {useRouter} from 'next/router';
import styled from 'styled-components'

export default function BasicLayout({children}) {
    const router = useRouter();
    return (
        <>
            <Navbar/>
            <main>{children}</main>
        </>
    )
}
