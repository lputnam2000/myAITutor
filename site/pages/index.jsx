import Link from 'next/link'
import { useRouter } from 'next/router';

function Home() {
    const router = useRouter();
    const clicker1 = () => {router.push("/workspace")};
    const clicker2 = () => {router.push("/api/auth/signout")};
    const clicker3 = () => {router.push("/api/auth/signin")};

    return(
        <>
            <button onClick={clicker1}>Go to Workspace</button>
            <button onClick={clicker2}>sign out</button>
            <button onClick={clicker3}>sign in</button>
        </>
    );
}

export default Home;