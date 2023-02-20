import React from 'react';
import {useRouter} from 'next/router'


function PageSummary(props) {
    const router = useRouter()
    const {uploadId} = router.query

    return <p>{uploadId}</p>
        ;
}

export async function getServerSideProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    }
}

export default PageSummary;