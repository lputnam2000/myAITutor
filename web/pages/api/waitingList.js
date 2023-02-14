import {prisma} from "../../../db";

const requestHandler = (req, res) => {
    if (req.method == "POST") {
        console.log(req.body.email)
        // let user = prisma.user
        //     .create({
        //         data: {
        //             name: req.body.name,
        //             email: req.body.email,
        //         },
        //     })
        //     .then(async () => {
        //         await prisma.$disconnect();
        //         res.status(200).json({ok: "ok"});
        //         return;
        //     })
        //     .catch(async (e) => {
        //         console.error(e);
        //         await prisma.$disconnect();
        //         res.status(400).json({error: e});
        //         return;
        //     });
    } else {
        res.status(200).json({name: "John Doe"});
    }
};

export default requestHandler;
