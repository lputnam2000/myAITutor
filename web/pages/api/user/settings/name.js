import clientPromise from "../../../../lib/mongodb";
import {getServerSession} from "next-auth/next";
import {authOptions} from "/pages/api/auth/[...nextauth]";
import {ObjectId} from "mongodb";

const requestHandler = async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    const body = req.body;
    if (req.method === "PATCH") {
        if (session) {
            try {
                const client = await clientPromise;
                const db = client.db("admin");
                const usersCollection = db.collection("users");
                const userIDObject = new ObjectId(session.user.id);
                const userRecord = await usersCollection.findOne({"_id": userIDObject});
                if (userRecord !== null) {
                    const {newName} = req.body;
                    console.log(`Updating Name for User: ${session.user.id} - ${newName}`);
                    const r = await usersCollection.updateOne({_id: userIDObject}, {$set: {name: newName}});
                    res.status(200).json({message: "Name updated successfully"});
                } else {
                    res.status(400).json({"message": "user not found"})
                }
            } catch (e) {
                res.status(500).json({error: e})
                console.error(e);
            }
        } else {
            // Not Signed in
            res.status(401).json({'error': "No authentication"});
        }
    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
};

export default requestHandler;
