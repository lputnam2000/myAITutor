import clientPromise from "../../../lib/mongodb";
import {getServerSession} from "next-auth/next"
import {authOptions} from "pages/api/auth/[...nextauth]";
import AWS from 'aws-sdk';
import logger from '../../../logger/logger'

const REGION = process.env.CB_AWS_REGION;
const URL_EXPIRATION_TIME = 300; // in seconds
AWS.config.update({signatureVersion: 'v4'})

const thumbnailBucket = new AWS.S3({
    accessKeyId: process.env.CB_AWS_ACCESS_ID,
    secretAccessKey: process.env.CB_AWS_ACCESS_KEY,
    params: {Bucket: process.env.CB_AWS_THUMBNAIL_BUCKET},
    region: REGION,
})

const videoThumbnailBucket = new AWS.S3({
    accessKeyId: process.env.CB_AWS_ACCESS_ID,
    secretAccessKey: process.env.CB_AWS_ACCESS_KEY,
    params: {Bucket: process.env.CB_AWS_VIDEO_THUMBNAIL_BUCKET},
    region: REGION,
})

async function generatePreSignedGetUrl(bucket, key) {
    let result = bucket.getSignedUrlPromise('getObject', {
        Key: key,
        Expires: URL_EXPIRATION_TIME,
    }).then((url) => {
        return url
    })
    return result
}


const requestHandler = async (req, res) => {
    const session = await getServerSession(req, res, authOptions)
    const body = req.body;
    if (req.method === "GET") {
        if (session) {
            try {
                const client = await clientPromise;
                const db = client.db("data");
                const uploadsCollection = db.collection("UserUploads");
                const userUploads = await uploadsCollection.findOne({
                    'userid': session.user.id
                }, {uploads: 1})
                if (userUploads !== null) {
                    let results = await Promise.all(userUploads['uploads'].map(async (upload) => {
                        if (upload.type === 'pdf') {
                            upload.thumbnail = await generatePreSignedGetUrl(thumbnailBucket, upload.uuid);
                        } else if (upload.type === 'mp4') {
                            upload.thumbnail = await generatePreSignedGetUrl(videoThumbnailBucket, upload.uuid);
                        }
                        return upload;
                    }))

                    res.status(200).json({uploads: results})
                } else {
                    res.status(200).json({uploads: []})
                }
            } catch (e) {
                res.status(500).json({error: e})
                console.error(e);
            }
        } else {
            // Not Signed in
            res.status(401)
            res.json({"Error": "No authentication"})
        }
    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
    res.end();
};

export default requestHandler;
