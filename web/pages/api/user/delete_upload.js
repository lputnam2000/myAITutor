import clientPromise from "../../../lib/mongodb";
import {getServerSession} from "next-auth/next";
import {authOptions} from "/pages/api/auth/[...nextauth]";

const requestHandler = async (req, res) => {
    const session = await getServerSession(req, res, authOptions)
    const body = req.body;
    if (req.method === "DELETE") {
        if (session) {
            const {key, fileType} = req.query
            if (key) {
                console.log(`Deleting Upload: ${key}`)
                try {
                    const client = await clientPromise;
                    const db = client.db("data");
                    const uploadsCollection = db.collection("UserUploads");
                    const result = await uploadsCollection.updateOne(
                        {'userid': session.user.id},
                        {$pull: {uploads: {'uuid': key}}}
                    );
                    if (fileType === 'pdf') {
                        const collection = db.collection('SummaryDocuments');
                        const r = await collection.deleteOne({_id: key});
                    } else if (fileType === 'url') {
                        const collection = db.collection('SummaryWebsites');
                        const r = await collection.deleteOne({_id: key});
                    } else if (fileType === 'youtube') {
                        const collection = db.collection('SummaryYoutube');
                        const r = await collection.deleteOne({_id: key});
                    }
                } catch (e) {
                    res.status(500).json({error: e})
                    console.error(e);
                }

            } else {
                res.status(400).json({'error': 'Invalid Key'})
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
