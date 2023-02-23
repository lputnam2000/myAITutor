import clientPromise from "../../../lib/mongodb";
import {getServerSession} from "next-auth/next"
import {authOptions} from "pages/api/auth/[...nextauth]";

const requestHandler = async (req, res) => {
    if (req.method === "GET") {
        const session = await getServerSession(req, res, authOptions)
        const body = req.body;
        if (session) {
            try {
                const client = await clientPromise;
                const db = client.db("data");
                const uploadsCollection = db.collection("UserUploads");
                const userUploads = await uploadsCollection.find({
                    'userid': session.user.id
                }, {}).project({uploads: 1}).limit(1).toArray()
                if (userUploads.length !== 0) {
                    res.status(200).json({uploads: userUploads[0]['uploads']})
                } else {
                    res.status(200).json({uploads: []})
                }
            } catch (e) {
                res.status(500).json({error: e})
                console.error(e);
            }
        } else {
            // Not Signed in
            res.status(401)
            res.json({"Error": "No authentication"})
        }
        res.end()
    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
};

export default requestHandler;
