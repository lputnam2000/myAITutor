import clientPromise from "../../../lib/mongodb";
import {getServerSession} from "next-auth/next";
import {authOptions} from "/pages/api/auth/[...nextauth]";

const addAnswerToBody = async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    const body = req.body;

    if (req.method === "POST") {
        if (session) {
            const {answer, contexts, questionTagSelected, query, fileType, key} = req.body
            let documentCollection = 'SummaryDocuments'
            if (fileType === 'youtube') {
                documentCollection = 'SummaryYoutube'
            } else if (fileType === 'url') {
                documentCollection = 'SummaryWebsites'
            } else if (fileType === 'mp4') {
                documentCollection = 'SummaryVideos'
            }

            try {
                const client = await clientPromise;
                const db = client.db("data");
                const collection = db.collection(documentCollection);
                const newAnswer = {
                    answer, contexts, questionTagSelected, query
                }
                const filter = {'_id': key}

                const updateResult = await collection.updateOne(filter, {
                    $push: {
                        answers: {
                            $each: [newAnswer],
                            $position: 0,
                        },
                    },
                });

                console.log('Updated document count:', updateResult.modifiedCount);
                res.status(200).json({message: "Updated answers"});
            } catch (e) {
                console.log("Failed to add answer");
                res.status(500).json({error: e});
                console.error(e);
            }
        } else {
            // Not Signed in
            res.status(401).json({Error: "No authentication"});
        }
    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
};

export default addAnswerToBody;
