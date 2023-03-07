import cors from 'cors'

export default async function handler(req, res) {
    cors({
        origin: '*'
    })(req, res, async () => {
        if (req.method === "POST") {
            try {
                const content = req.body;
                console.log("recieved: ", content)
                return res.status(200).json({ 'message': 'Inserted Successfully' })
            } catch (e) {
                console.error(e);
                return res.status(400).json({ 'error': e }).end()
            }
        } else {
            return res.status(404).json({ message: "Invalid method for endpoint" });
        }
    });

};