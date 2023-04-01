import {getServerSession} from "next-auth/next"
import {authOptions} from 'pages/api/auth/[...nextauth]'
import clientPromise from "/lib/mongodb"
import {v4 as uuidv4} from 'uuid';
import axios from "axios";

/**
 * Return a uuid to store the object in s3 under while also keeping track of who owns the object
 * **/
async function generateRecord(session, url) {
    const client = await clientPromise;
    const db = client.db("data");
    let today = new Date();
    let title = url
    let owner = session.user.id
    let uuid = uuidv4();

    let uploads = db.collection("UserUploads");
    const documentsCollection = db.collection('SummaryWebsites');
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
                {$set: {"uploads": [{uuid, title, status: 'Not Ready', type: 'url'}]}},
                {upsert: true}
            );
            documentsCollection.insertOne({
                _id: uuid,
                owner,
                title,
                status: 'Not Ready',
                summary: [],
                type: 'url',
                url
            });
        } else {
            // console.log("Record already exists:", result);
            let currentData = uploads.count({'userid': owner}, {limit: 1})
            if (currentData && currentData.uploads) {
                while (currentData.uploads.includes(uuid)) {
                    uuid = uuidv4();
                }
            }
            uploads.update(record, {
                $push: {"uploads": {uuid, title, status: 'Not Ready', type: 'url'}}
            })
            documentsCollection.insertOne({
                _id: uuid,
                owner,
                title,
                status: 'Not Ready',
                isWebsiteReady: false,
                summary: [],
                type: 'url',
                url
            });
        }
    });
    let fullyQualifiedName = uuid;
    return fullyQualifiedName
}

export default async (req, res) => {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        // Signed in
        if (req.method == 'POST') {
            const {url} = req.body
            //First, validate the data and send back an error message if data is invalid
            //S3
            let user_id = session.user.id
            let fullyQualifiedName = await generateRecord(session, url)
            fetch(process.env.BACKEND_URL + '/embeddings/websites/', {
                method: 'POST',
                body: JSON.stringify({
                    key: fullyQualifiedName,
                    user_id: user_id,
                    url,
                }),
                headers: {
                    'X-API-Key': process.env.CB_API_SECRET,
                    'Content-Type': 'application/json'
                }
            })
            res.status(200)
            res.json({"key": fullyQualifiedName, 'fileName': url})
        } else {
            res.status(404)
            res.json({"Error": "404"})
        }
    } else {
        // Not Signed in
        res.status(401)
        res.json({"Error": "No authentication"})
    }
    res.end()
}

