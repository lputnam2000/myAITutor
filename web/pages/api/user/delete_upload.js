import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "/pages/api/auth/[...nextauth]";
import AWS from "aws-sdk";
import weaviate from "weaviate-client";

const weaviateClient = weaviate.client({
    scheme: "https",
    host: "chimpbase.weaviate.network",
    authClientSecret: new weaviate.AuthUserPasswordCredentials({
        username: "aryamanparekh12@gmail.com",
        password: "pBCjEiL6GGN5fjQ",
        scopes: ["offline_access"]  // optional, depends on the configuration of your identity provider (not required with WCS)
    }),
});

const getWeaviateClassName = (key) => {
    let key_fmtd = key.replaceAll('-', '_')
    return `Document_${key_fmtd}`
}

const deleteUpload = async (req, res) => {
    const session = await getServerSession(req, res, authOptions)
    const body = req.body;
    if (req.method === "DELETE") {
        if (session) {
            const { key, fileType } = req.query
            if (key) {
                console.log(`Deleting Upload: ${key}`)
                try {
                    const client = await clientPromise;
                    const db = client.db("data");
                    const uploadsCollection = db.collection("UserUploads");
                    const result = await uploadsCollection.updateOne(
                        { 'userid': session.user.id },
                        { $pull: { uploads: { 'uuid': key } } }
                    );
                    if (key == "103db47b-e6a7-4c5a-a543-e9f40062b0dc" || key == "d6190bcb-0bc6-4464-89c8-a1431db4546a") {
                        console.log("did not actually delete")
                        res.status(400).json({ 'Exception': 'Could not delete; this is a demo document' })
                    } else {
                        await weaviateClient.schema
                            .classDeleter()
                            .withClassName(getWeaviateClassName(key))
                            .do()
                            .then(res => {
                                console.log(res);
                            })
                            .catch(err => {
                                console.error(err)
                            });

                        AWS.config.update({ signatureVersion: 'v4' })
                        let S3_BUCKET = process.env.CB_AWS_UPLOAD_BUCKET;
                        const REGION = process.env.CB_AWS_REGION;
                        if (fileType === 'mp4') {
                            S3_BUCKET = process.env.CB_AWS_VIDEO_UPLOAD_BUCKET
                        }
                        const awsParams = {
                            Bucket: S3_BUCKET,
                            Key: key
                        };
                        const myBucket = new AWS.S3({
                            accessKeyId: process.env.CB_AWS_ACCESS_ID,
                            secretAccessKey: process.env.CB_AWS_ACCESS_KEY,
                            params: { Bucket: S3_BUCKET },
                            region: REGION,
                        })

                        if (fileType === 'pdf') {
                            const collection = db.collection('SummaryDocuments');
                            const r = await collection.deleteOne({ _id: key });
                            myBucket.deleteObject(awsParams, function (err, data) {
                                if (err) {
                                    console.log(err, err.stack);
                                } else {
                                    console.log('Object deleted successfully');
                                }
                            });
                        } else if (fileType === 'url') {
                            const collection = db.collection('SummaryWebsites');
                            const r = await collection.deleteOne({ _id: key });
                        } else if (fileType === 'youtube') {
                            const collection = db.collection('SummaryYoutube');
                            const r = await collection.deleteOne({ _id: key });
                        } else if (fileType === 'mp4') {
                            const collection = db.collection('SummaryVideos');
                            const r = await collection.deleteOne({ _id: key });
                            myBucket.deleteObject(awsParams, function (err, data) {
                                if (err) {
                                    console.log(err, err.stack);
                                } else {
                                    console.log('Object deleted successfully');
                                }
                            });
                        }
                    }
                } catch (e) {
                    res.status(500).json({ error: e })
                    console.error(e);
                }

            } else {
                res.status(400).json({ 'error': 'Invalid Key' })
            }
        } else {
            // Not Signed in
            res.status(401)
            res.json({ "Error": "No authentication" })
        }
    } else {
        return res.status(404).json({ message: "URL Not Found" });
    }
    res.end();
};

export default deleteUpload;
