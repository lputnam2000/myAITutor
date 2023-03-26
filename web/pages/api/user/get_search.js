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
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        "role": "system",
                        "content": "You are an Al assistant that is designed to quickly find answers given context and cite the context in your answers, making you incredibly helpful at answering questions."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature: 0.3
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
        let searchText = String(query);
        if (!searchText) {
            // handle empty query
            return res.status(400).json({ message: 'Invalid search query' });
          }
        const className = getClassName(key)
        let weaviateRes = await client.graphql
            .get()
            .withClassName(className)
            .withFields('text')
            .withNearText({
                concepts: [searchText],
                distance: 0.6,
              })
            .withLimit(2)
            .do()
        const matchingText = weaviateRes.data.Get[className]
        let prompt = "Answer the question using the provided chunks of context. Each chunk of context comes with a number in brackets before it. If you use a particular chunk to compose a particular part of your answer, finish that part of your answer by indicating the chunk used. Do this by including the chunks bracketed number. So if you want to indicate you used chunk 1, do [1]. Any answer you provide must have indicators of which chunks you used.\n\nContext:\n"
        for (let i = 0; i < matchingText.length; i++) {
            prompt += '\n[' + (i + 1) + '] ' + matchingText[i].text + '\n';
        }
        console.log(prompt)

        prompt += `Q:${query}` + "\nA:"
        getChatGPTAnswer(prompt).then(answer => {
            console.log(answer)
            return res.status(200).json({'answer': answer, 'contexts': matchingText})
        })

        // return res.status(200).json({s3Url: ''})
    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
};

export default requestHandler;
