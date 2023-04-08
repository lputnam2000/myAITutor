import clientPromise from "../../../lib/mongodb";
import {getServerSession} from "next-auth/next";
import {authOptions} from "/pages/api/auth/[...nextauth]";

const requestHandler = async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    const body = req.body;

    if (req.method === "PATCH") {
        if (session) {
            const {key, newTitle, fileType} = req.query;
            if (key && newTitle && fileType) {
                console.log(`Updating title for Upload: ${key} - ${fileType}`);
                try {
                    const client = await clientPromise;
                    const db = client.db("data");
                    const uploadsCollection = db.collection("UserUploads");

                    const result = await uploadsCollection.updateOne(
                        {userid: session.user.id, "uploads.uuid": key},
                        {$set: {"uploads.$.title": newTitle}}
                    );

                    if (fileType === 'pdf') {
                        const collection = db.collection('SummaryDocuments');
                        const r = await collection.updateOne({_id: key}, {$set: {title: newTitle}});
                    } else if (fileType === 'url') {
                        const collection = db.collection('SummaryWebsites');
                        const r = await collection.updateOne({_id: key}, {$set: {title: newTitle}});
                    } else if (fileType === 'youtube') {
                        const collection = db.collection('SummaryYoutube');
                        const r = await collection.updateOne({_id: key}, {$set: {title: newTitle}});
                    }

                    res.status(200).json({message: "Title updated successfully"});
                } catch (e) {
                    res.status(500).json({error: e});
                    console.error(e);
                }
            } else {
                res.status(400).json({error: "Invalid key or newTitle"});
            }
        } else {
            // Not Signed in
            res.status(401).json({Error: "No authentication"});
        }
    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
};

export default requestHandler;
