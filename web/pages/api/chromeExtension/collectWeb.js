import cors from 'cors'
import clientPromise from "../../../lib/mongodb";
import {v4 as uuidv4} from 'uuid';

async function secretToUser(secret) {
    try {
        const client = await clientPromise;
        const db = client.db("admin");
        const accountCollection = db.collection("users");
        const userRecord = await accountCollection.findOne({ "apikey": secret });
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
    console.log(user_id)
    const client = await clientPromise;
    const db = client.db("data");
    let today = new Date();
    // let title = title
    let owner = user_id
    let uuid = uuidv4();

    let uploads = db.collection("UserUploads");
    const documentsCollection = db.collection('SummaryWebsites');
    const record = {userid: owner};

    uploads.findOne(record, (err, result) => {
        if (err) {
            console.log(err);
        } else if (!result) {
            // console.log('ashank')
            uploads.insertOne(record, (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Record added");
                }
            });
            uploads.updateOne(
                record,
                {$set: {"uploads": [{uuid, title, status: 'Not Ready', type: 'html'}]}},
                {upsert: true}
            );
            documentsCollection.insertOne({
                _id: uuid,
                owner,
                title,
                status: 'Not Ready',
                summary: [],
                type: 'html',
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
                $push: {"uploads": {uuid, title, status: 'Not Ready', type: 'html'}}
            })
            documentsCollection.insertOne({
                _id: uuid,
                owner,
                title,
                status: 'Not Ready',
                summary: [],
                type: 'html',
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
                const title =  "ashank"// change once extension updated
                const authHeader = req.headers.authorization;
                let secret = null
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    secret = authHeader.substring(7);
                }
                const user_id_from_secret = await secretToUser(secret)
                let fullyQualifiedName = await generateRecord(user_id_from_secret, data, title)
                fetch(process.env.BACKEND_URL + '/embeddings/extension/', {
                    method: 'POST',
                    body: JSON.stringify({
                        key: fullyQualifiedName,
                        user_id: user_id_from_secret,
                        content: data
                    }),
                    headers: {
                        'X-API-Key': process.env.CB_API_SECRET,
                        'Content-Type': 'application/json'
                    }
                })
                res.status(200)
                res.json({"key": fullyQualifiedName, 'fileName': title})
                //TODO use `user_id_from_secret` and `data.content` to add this html to someone's summaries
                // fetch(process.env.BACKEND_URL + '/embeddings/extension/', {
                //     method: 'POST',
                //     body: JSON.stringify({
                //         content: data,
                //         user_id_from_secret: user_id_from_secret,
                //     }),
                //     headers: {
                //         'X-API-Key': process.env.CB_API_SECRET,
                //         'Content-Type': 'application/json'
                //     }
                // })
                // res.json({"key": fullyQualifiedName, 'fileName': url})
                // return res.status(200).json({ 'message': 'TODO: actually make this work' })
            } catch (e) {
                console.error(e);
                return res.status(400).json({ 'error': e }).end()
            }
        } else {
            return res.status(404).json({ message: "Invalid method for endpoint" });
        }
    });

};