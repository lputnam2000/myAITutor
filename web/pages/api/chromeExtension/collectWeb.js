import cors from 'cors'
import clientPromise from "../../../lib/mongodb";
import {v4 as uuidv4} from 'uuid';

async function secretToUser(secret) {
    try {
        const client = await clientPromise;
        const db = client.db("admin");
        const accountCollection = db.collection("users");
        const userRecord = await accountCollection.findOne({"apiKey": secret});
        if (userRecord !== null) {
            return userRecord["_id"].toString()
        } else {
            return null
        }
    } catch (e) {
        console.error(e);
        return null
    }
}

async function generateRecord(user_id, html, title) {
    const client = await clientPromise;
    const db = client.db("data");
    let today = new Date();
    // let title = title
    let owner = user_id
    let uuid = uuidv4();

    let uploads = db.collection("UserUploads");
    const websitesCollection = db.collection('SummaryWebsites');
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
            websitesCollection.insertOne({
                _id: uuid,
                owner,
                title,
                status: 'Not Ready',
                summary: [],
                type: 'url',
                html
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
                $push: {
                    "uploads": {
                        $each: [{uuid, title, status: 'Not Ready', type: 'url'}],
                        $position: 0
                    }
                }
            })
            websitesCollection.insertOne({
                _id: uuid,
                owner,
                title,
                status: 'Not Ready',
                summary: [],
                type: 'url',
                html
            });
        }
    });
    let fullyQualifiedName = uuid;
    return fullyQualifiedName
}

export default async function handler(req, res) {
    cors({
        origin: '*'
    })(req, res, async () => {
        if (req.method === "POST") {
            try {
                const data = req.body['content'];
                const title = req.body['title'];
                const authHeader = req.headers.authorization;
                let secret = null
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    secret = authHeader.substring(7);
                }
                const user_id_from_secret = await secretToUser(secret)
                console.log(user_id_from_secret)
                if (!user_id_from_secret) {
                    return res.status(401).json({error: "invalid credentials"}).end()
                }
                let fullyQualifiedName = await generateRecord(user_id_from_secret, data, title)
                fetch(process.env.BACKEND_URL + '/embeddings/extension/', {
                    method: 'POST',
                    body: JSON.stringify({
                        key: fullyQualifiedName,
                        user_id: user_id_from_secret,
                        content: data,
                        title: title,
                    }),
                    headers: {
                        'X-API-Key': process.env.CB_API_SECRET,
                        'Content-Type': 'application/json'
                    }
                })

                res.status(200).json({"key": fullyQualifiedName, 'fileName': title})
            } catch (e) {
                console.error(e);
                return res.status(400).json({'error': e}).end()
            }
        } else {
            return res.status(404).json({message: "Invalid method for endpoint"}).end();
        }
    });

};