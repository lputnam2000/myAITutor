import clientPromise from "../../../lib/mongodb";
import {getServerSession} from "next-auth/next"
import {authOptions} from "pages/api/auth/[...nextauth]";
import {v4 as uuidv4} from 'uuid';
import { ObjectId } from 'mongodb';

const requestHandler = async (req, res) => {
    const session = await getServerSession(req, res, authOptions)
    const body = req.body;
    if (req.method === "GET") {
        if (session) {
            try {
                const client = await clientPromise;
                const db = client.db("admin");
                const accountCollection = db.collection("accounts");
                const objectId = new ObjectId(session.user.id);
                const userRecord = await accountCollection.findOne({"userId": objectId});
                if (userRecord !== null) {
                    let apikey = uuidv4();
                    await accountCollection.updateOne(
                        { userid: session.user.id },
                        { $set: { "apikey": apikey } }
                      );
                    res.status(200).json({"apikey": apikey})
                } else {
                    res.status(200).json({"apikey": "no account found"})
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
    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
    res.end();
};

export default requestHandler;
