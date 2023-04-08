import clientPromise from "../../../lib/mongodb";
import {getServerSession} from "next-auth/next";
import {authOptions} from "/pages/api/auth/[...nextauth]";

const addSuggestion = async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    const body = req.body;

    if (req.method === "POST") {
        if (session) {
            const {rating, suggestion} = req.body;
            try {
                const client = await clientPromise;
                const db = client.db("data");
                const suggestionsCollection = db.collection("Suggestions");

                const newSuggestion = {
                    'userId': session.user.id,
                    'rating': rating,
                    'suggestion': suggestion
                }
                await suggestionsCollection.insertOne(newSuggestion);
                console.log("Suggestion added successfully");
                res.status(200).json({message: "Suggestion added successfully"});
            } catch (e) {
                console.log("Failed to add suggestion");
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

export default addSuggestion;
