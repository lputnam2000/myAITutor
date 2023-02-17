import clientPromise from "../../lib/mongodb";

const requestHandler = async (req, res) => {
    if (req.method === "POST") {
        try {
            const client = await clientPromise
            const db = client.db('data');
            const collection = db.collection('waiting_list');
            const email = req.body.email;

            collection.insertOne({email}, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({'error': 'MongoDB is Down'})

                }
                console.log('Email inserted successfully:', email);
            });
            return res.status(200).json({'message': 'Email Inserted Successfully'})
        } catch (e) {
            console.error(e);
            return res.status(400).json({'error': e}).end()
        }
    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
};

export default requestHandler;
