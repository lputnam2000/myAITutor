import AWS from 'aws-sdk'
import {getServerSession} from "next-auth/next"
import {authOptions} from 'pages/api/auth/[...nextauth]'
import clientPromise from "/lib/mongodb"
import {v4 as uuidv4} from 'uuid';

const S3_BUCKET = process.env.CB_AWS_VIDEO_UPLOAD_BUCKET;
const REGION = process.env.CB_AWS_REGION;
const URL_EXPIRATION_TIME = 300; // in seconds
AWS.config.update({signatureVersion: 'v4'})
const myBucket = new AWS.S3({
    accessKeyId: process.env.CB_AWS_ACCESS_ID,
    secretAccessKey: process.env.CB_AWS_ACCESS_KEY,
    params: {Bucket: S3_BUCKET},
    region: REGION,
})

function generatePreSignedPutUrl(fileName, fileType, userid) {
    let result = myBucket.getSignedUrlPromise('putObject', {
        Key: fileName,
        ContentType: fileType,
        Expires: URL_EXPIRATION_TIME,
        Metadata: {
            userid: userid,
        }
    }).then((url) => {
        return url
    })
    return result
}

/**
 * Return a uuid to store the object in s3 under while also keeping track of who owns the object
 * **/
async function generateRecord(session, fileName) {
    const client = await clientPromise;
    const db = client.db("data");
    let today = new Date();
    let title = fileName ? fileName : ""
    let owner = session.user.id
    let uuid = uuidv4();

    let uploads = db.collection("UserUploads");
    const videosCollection = db.collection('SummaryVideos');
    const record = {userid: owner};
    try {
        const result = await uploads.findOne(record);
        if (!result) {
            await Promise.all([
                uploads.insertOne(record),
                videosCollection.insertOne({
                    _id: uuid, owner, title, progress: 0,
                    progressMessage: '', summary: [], type: 'mp4',
                    answers: []
                })
            ]);
            await uploads.updateOne(
                record,
                {$set: {"uploads": [{uuid, title, progress: 0, type: 'mp4'}]}},
                {upsert: true}
            );
        } else {
            await Promise.all([
                uploads.update(record, {
                    $push: {
                        "uploads": {
                            $each: [{uuid, title, progress: 0, type: 'mp4'}],
                            $position: 0
                        }
                    }
                }),
                videosCollection.insertOne({
                    _id: uuid, owner, title, progress: 0,
                    progressMessage: '', summary: [], type: 'mp4',
                    answers: []
                })
            ]);
        }
    } catch (error) {
        console.log(error)
    }
    return uuid;
}

export default async (req, res) => {
    const session = await getServerSession(req, res, authOptions)
    const body = req.body;
    if (session) {
        // Signed in
        if (req.method == 'POST') {
            //First, validate the data and send back an error message if data is invalid
            if (body["fileName"] == null) {
                res.status(400)
                res.json({"Error": "Please add a filename"})
            } else if (body["fileType"] !== "video/mp4") {
                res.status(400)
                res.json({"Error": "Please only upload mp4 files"})
            } else {
                //S3
                const owner = session.user.id
                let fullyQualifiedName = await generateRecord(session, body["fileName"])
                await generatePreSignedPutUrl(fullyQualifiedName, body["fileType"], owner).then((url) => {
                    res.status(200)
                    res.json({"signedUrl": url, 'fileName': fullyQualifiedName})
                })
            }
        } else {
            res.status(400)
            res.json({"Error": "This endpoint only accepts POST"})
        }
    } else {
        // Not Signed in
        res.status(401)
        res.json({"Error": "No authentication"})
    }
    res.end()
}

