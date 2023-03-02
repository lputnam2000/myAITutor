import clientPromise from "../../../lib/mongodb";
import {getServerSession} from "next-auth/next"
import {authOptions} from "pages/api/auth/[...nextauth]";

const weaviate = require("weaviate-client");
const OPEN_AI_KEY = "''"
const {Configuration, OpenAIApi} = require("openai");
const configuration = new Configuration({
    apiKey: OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);
const client = weaviate.client({
    scheme: "https",
    host: "chimpbase.weaviate.network",
    authClientSecret: new weaviate.AuthUserPasswordCredentials({
        username: "aryamanparekh12@gmail.com",
        password: "pBCjEiL6GGN5fjQ",
        scopes: ["offline_access"]  // optional, depends on the configuration of your identity provider (not required with WCS)
    }),
    headers: {
        "X-OpenAI-Api-Key": OPEN_AI_KEY
    }
});


async function getChatGPTAnswer(prompt) {

    try {
        let response = await openai.createChatCompletion(
            {
            model:'gpt-3.5-turbo',
            messages:[
                {"role": "system", "content":"You are an AI assistant that is designed to quickly find answers given context, making you incredibly helpful at answering questions."},
                {"role": "user", "content":prompt}
            ]
            }
        )
        console.log(response)
        const output = response.data.choices[0]['message']['content']
        return output;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getClassName = (key) => {
    return `Document_${key.replaceAll('-', '_')}`
}

const requestHandler = async (req, res) => {
    if (req.method === "GET") {
        const {query, key} = req.query
        console.log(key)

        const className = getClassName(key)
        let weaviateRes = await client.graphql
            .get()
            .withClassName(className)
            .withFields('text')
            .withLimit(2)
            .do()
        const matchingText = weaviateRes.data.Get[className]
        let prompt = "Answer the question in detail using the provided context, and if the answer is not contained within the text below, say 'I don't know.'\n\nContext:\n"
        for (let i = 0; i < matchingText.length; i++) {
            prompt += '\n' + matchingText[i].text + '\n'
        }
        console.log(prompt)

        prompt += `Q:${query}` + "\nA:"
        getChatGPTAnswer(prompt).then(answer => {
            console.log(answer)
            return res.status(200).json({'answer': answer})
        })

        // return res.status(200).json({s3Url: ''})
    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
};

export default requestHandler;
