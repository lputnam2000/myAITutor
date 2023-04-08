import clientPromise from "../../../lib/mongodb";
import {getServerSession} from "next-auth/next"
import {authOptions} from "pages/api/auth/[...nextauth]";

export const config = {
    runtime: 'edge',
}

const requestHandler = async (req, res) => {
    if (req.method === "GET") {
        const {key} = req.query
        if (key) {
            const client = await clientPromise;
            const db = client.db("data");
            const videoDocuments = db.collection("SummaryYoutube");
            const documentDetails = await videoDocuments.findOne({_id: key});
            return res.status(200).json({documentDetails: documentDetails})
        } else {
            res.status(400).json({'error': 'Invalid Key'})
        }
    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
};

export default requestHandler;
