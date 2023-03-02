import clientPromise from "../../../lib/mongodb";
import {getServerSession} from "next-auth/next"
import {authOptions} from "pages/api/auth/[...nextauth]";

const requestHandler = async (req, res) => {
    if (req.method === "POST") {
        const {pdfKey, startPage, endPage} = req.body
        console.log(pdfKey)
        fetch(process.env.BACKEND_URL+'/summaries/', {
            method: 'POST',
            body: JSON.stringify({
                pdfKey,
                startPage,
                endPage
            }),
            headers: {
                'X-API-Key' : process.env.CB_API_SECRET,
                'Content-Type' : 'application/json'
            }
        })
        console.log('hi')

    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
};

export default requestHandler;
