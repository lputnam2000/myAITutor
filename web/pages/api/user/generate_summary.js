import clientPromise from "../../../lib/mongodb";
import {getServerSession} from "next-auth/next"
import {authOptions} from "pages/api/auth/[...nextauth]";

const requestHandler = async (req, res) => {
    if (req.method === "POST") {
        const {pdfKey, startPage, endPage} = req.body
        console.log(pdfKey)
        fetch('http://127.0.0.1:5000/summaries/', {
            method: 'POST',
            body: JSON.stringify({
                pdfKey,
                startPage,
                endPage
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log('hi')

    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
};

export default requestHandler;
