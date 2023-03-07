import clientPromise from "../../../lib/mongodb";
import {getServerSession} from "next-auth/next"
import {authOptions} from "pages/api/auth/[...nextauth]";

const requestHandler = async (req, res) => {
    if (req.method === "POST") {
        const {key} = req.body
        fetch(process.env.BACKEND_URL + '/summaries/websites/', {
            method: 'POST',
            body: JSON.stringify({
                key,
            }),
            headers: {
                'X-API-Key': process.env.CB_API_SECRET,
                'Content-Type': 'application/json'
            }
        })
        return res.status(200).json({message: "generating summary"});

    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
};

export default requestHandler;
