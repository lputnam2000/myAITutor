import {getServerSession} from "next-auth/next"
import {authOptions} from 'pages/api/auth/[...nextauth]'
import clientPromise from "/lib/mongodb"
import {v4 as uuidv4} from 'uuid';

/**
 * Return a uuid to store the object in s3 under while also keeping track of who owns the object
 * **/
async function generateRecord(session, url, title) {
    const client = await clientPromise;
    const db = client.db("data");
    let today = new Date();
    let owner = session.user.id
    let uuid = uuidv4();

    let uploads = db.collection("UserUploads");
    const videoCollection = db.collection('SummaryYoutube');
    const record = {userid: owner};
    try {
        const result = await uploads.findOne(record);
        if (!result) {
            await Promise.all([
                uploads.insertOne(record),
                videoCollection.insertOne({
                    _id: uuid,
                    owner,
                    title,
                    progress: 0,
                    progressMessage: '',
                    summary: [],
                    type: 'youtube',
                    transcript: [],
                    url
                })
            ]);
            await uploads.updateOne(
                record,
                {$set: {"uploads": [{uuid, title, progress: 0, type: 'youtube', url}]}},
                {upsert: true}
            );
        } else {
            await Promise.all([
                uploads.update(record, {
                    $push: {
                        "uploads": {
                            $each: [{uuid, title, progress: 0, type: 'youtube', url}],
                            $position: 0
                        }
                    }
                }), videoCollection.insertOne({
                    _id: uuid,
                    owner,
                    title,
                    progress: 0,
                    progressMessage: '',
                    summary: [],
                    type: 'youtube',
                    transcript: [],
                    url
                })
            ]);
        }
    } catch (error) {
        console.log(error)
    }

    return uuid;
}

async function addYoutubeVideo(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        // Signed in
        if (req.method == 'POST') {
            const {url, title} = req.body
            //First, validate the data and send back an error message if data is invalid
            //S3
            let user_id = session.user.id
            let fullyQualifiedName = await generateRecord(session, url, title)
            await fetch(process.env.BACKEND_URL + '/embeddings/youtube_video/', {
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
            }).then((res) => {
                console.log(res)
            }).catch(() => {
                console.log('error')
            })

            res.status(200)
            res.json({"key": fullyQualifiedName, 'url': url, 'title': title})
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

export default addYoutubeVideo