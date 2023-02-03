import Link from 'next/link'
import { useRouter } from 'next/router';
import { Card, CardHeader, CardBody, CardFooter, Text } from '@chakra-ui/react'

function Home() {
    const router = useRouter();
    const clicker1 = () => { router.push("/workspace") };
    const clicker2 = () => { router.push("/api/auth/signout") };
    const clicker3 = () => { router.push("/api/auth/signin") };

    return (
        <>
            <div className={`bg-gray-900 min-h-screen min-w-full font-mono`}>
                <div className={`w-2/3 min-h-screen mx-auto bg-gray-800/20`}>
                    <div className={`w-full h-screen grid grid-cols-3 grid-rows-3`}>
                        <div className={`bg-indigo-300 row-start-1 col-start-1 col-span-3`}>
                            <button className={`h-20 bg-indigo-50 rounded px-1 py-1`} onClick={clicker1}>Go to Workspace</button>
                            <button className={`h-20 bg-indigo-50 rounded px-1 py-1`} onClick={clicker2}>sign out</button>
                            <button className={`h-20 bg-indigo-50 rounded px-1 py-1`} onClick={clicker3}>sign in</button>
                        </div>
                        <div className={`bg-green-500 row-start-2 row-span-2`}>
                        </div>
                        <div className={`col-start-2 col-span-2 row-start-2 row-span-2 h-full w-full grid grid-cols-3 grid-rows-3 grid-flow-row place-content-evenly gap-3`}>
                            <Card w='100%' h='10rem'>
                                <CardBody>
                                    <Text>Description of project recently worked on</Text>
                                </CardBody>
                            </Card>
                            <Card w='100%' h='10rem'>
                                <CardBody>
                                    <Text>Description of project recently worked on</Text>
                                </CardBody>
                            </Card>
                            <Card w='100%m' h='10rem'>
                                <CardBody>
                                    <Text>Description of project recently worked on</Text>
                                </CardBody>
                            </Card>
                            <Card w='100%' h='10rem'>
                                <CardBody>
                                    <Text>Description of project recently worked on</Text>
                                </CardBody>
                            </Card>
                        
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;