import clientPromise from "../../../lib/mongodb";
import {getServerSession} from "next-auth/next"
import {authOptions} from "pages/api/auth/[...nextauth]";

const requestHandler = async (req, res) => {
    if (req.method === "POST") {
        console.log(req.body)
        const {pdfKey, startPage, endPage} = req.body
    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
};

export default requestHandler;
