import AWS from 'aws-sdk'
import {getServerSession} from "next-auth/next"
import {getSession} from "next-auth/react"
import {authOptions} from 'pages/api/auth/[...nextauth]'
import clientPromise from "/lib/mongodb"
import {v4 as uuidv4} from 'uuid';

const S3_BUCKET = process.env.CB_AWS_UPLOAD_BUCKET;
const REGION = process.env.CB_AWS_REGION;
const URL_EXPIRATION_TIME = 300; // in seconds
AWS.config.update({signatureVersion: 'v4'})
const myBucket = new AWS.S3({
    accessKeyId: process.env.CB_AWS_ACCESS_ID,
    secretAccessKey: process.env.CB_AWS_ACCESS_KEY,
    params: {Bucket: S3_BUCKET},
    region: REGION,
})

function generatePreSignedPutUrl(fileName, fileType) {
    let result = myBucket.getSignedUrlPromise('putObject', {
        Key: fileName,
        ContentType: fileType,
        Expires: URL_EXPIRATION_TIME,
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
    const documentsCollection = db.collection('SummaryDocuments');
    const record = {userid: owner};

    uploads.findOne(record, (err, result) => {
        if (err) {
            console.log(err);
        } else if (!result) {
            uploads.insertOne(record, (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Record added");
                }
            });
            uploads.updateOne(
                record,
                {$set: {"uploads": [{uuid, title, status: 'Not Ready'}]}},
                {upsert: true}
            );
            documentsCollection.insertOne({_id: uuid, owner, title, status: 'Not Ready', summary: []});
        } else {
            console.log("Record already exists:", result);
            var currentData = uploads.count({'userid': owner}, {limit: 1})
            if (currentData && currentData.uploads) {
                while (currentData.uploads.includes(uuid)) {
                    uuid = uuidv4();
                }
            }
            uploads.update(record, {
                $push: {"uploads": {uuid, title, status: 'Not Ready'}}
            })
            documentsCollection.insertOne({_id: uuid, owner, title, status: 'Not Ready', summary: []});
        }
    });
    let fullyQualifiedName = uuid;
    return fullyQualifiedName
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
            } else if (body["fileType"] !== "application/pdf") {
                res.status(400)
                res.json({"Error": "Please only upload pdf files"})
            } else {
                //S3
                let fullyQualifiedName = await generateRecord(session, body["fileName"])
                await generatePreSignedPutUrl(fullyQualifiedName, body["fileType"]).then((url) => {
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

