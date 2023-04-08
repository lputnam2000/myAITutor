import clientPromise from "../../../lib/mongodb";
import {getServerSession} from "next-auth/next"
import {authOptions} from "pages/api/auth/[...nextauth]";
import AWS from 'aws-sdk'

export const config = {
    runtime: 'edge',
}

const S3_BUCKET = process.env.CB_AWS_UPLOAD_BUCKET;
const REGION = process.env.CB_AWS_REGION;
const URL_EXPIRATION_TIME = 60 * 60 * 24; // in seconds
AWS.config.update({signatureVersion: 'v4'})
const myBucket = new AWS.S3({
    accessKeyId: process.env.CB_AWS_ACCESS_ID,
    secretAccessKey: process.env.CB_AWS_ACCESS_KEY,
    params: {Bucket: S3_BUCKET},
    region: REGION,
})

async function generatePreSignedGetUrl(key) {
    return await myBucket.getSignedUrlPromise('getObject', {
        Key: key,
        Expires: URL_EXPIRATION_TIME,
    })
}

const requestHandler = async (req, res) => {
    if (req.method === "GET") {
        const {key} = req.query
        if (key !== '136fe416-d18f-4051-9d5c-c2692fdcd50f') {
            res.status(401).json({error: 'Unauthorised'})
            return
        }
        if (key) {
            let s3Url = await generatePreSignedGetUrl(key)
            const client = await clientPromise;
            const db = client.db("data");
            const summaryDocuments = db.collection("SummaryDocuments");
            const documentDetails = await summaryDocuments.findOne({_id: key});
            return res.status(200).json({s3Url: s3Url, documentDetails: documentDetails})
        } else {
            res.status(400).json({'error': 'Invalid Key'})
        }
    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
};

export default requestHandler;
