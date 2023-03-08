import cors from 'cors'
import clientPromise from "../../../lib/mongodb";

async function secretToUser(secret) {
    try {
        const client = await clientPromise;
        const db = client.db("admin");
        const accountCollection = db.collection("accounts");
        const userRecord = await accountCollection.findOne({ "apikey": secret });
        if (userRecord !== null) {
            return userRecord["userId"]
        } else {
            return null
        }
    } catch (e) {
        console.error(e);
        return null
    }
}

export default async function handler(req, res) {
    cors({
        origin: '*'
    })(req, res, async () => {
        if (req.method === "POST") {
            try {
                const data = req.body;
                const authHeader = req.headers.authorization;
                let secret = null
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    secret = authHeader.substring(7);
                }
                const user_id_from_secret = await secretToUser(secret)
                //TODO use `user_id_from_secret` and `data.content` to add this html to someone's summaries

                return res.status(200).json({ 'message': 'TODO: actually make this work' })
            } catch (e) {
                console.error(e);
                return res.status(400).json({ 'error': e }).end()
            }
        } else {
            return res.status(404).json({ message: "Invalid method for endpoint" });
        }
    });

};