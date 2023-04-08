import clientPromise from "../../../lib/mongodb";
import {getServerSession} from "next-auth/next"
import {authOptions} from "pages/api/auth/[...nextauth]";

const weaviate = require("weaviate-client");
const OPEN_AI_KEY = "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"
const {Configuration, OpenAIApi} = require("openai");
const configuration = new Configuration({
    apiKey: OPEN_AI_KEY,
});
export const config = {
    runtime: 'edge',
}

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


async function getChatGPTAnswer(prompt, fileType) {
    let isDocument = fileType === 'mp4' || fileType === 'youtube'
    try {
        let response = await openai.createChatCompletion(
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        "role": "system",
                        "content": "You are an AI assistant that can provide answers to questions based on the provided context, which consists of chunks of text from a document or video transcripts. When answering the question, make sure to indicate the source of the information by including the chunk's reference number in brackets, like {1} or {2}. If the context comes from a video, the references should include timestamps, such as {1} or {2}, {3}.  Your answers must include the appropriate indicators for each chunk of context used to compose your response.\n" +
                            "\n" +
                            "Craft a well-structured, informative which may include bullet points, numbered lists, and other formatting elements to enhance readability and presentation. Insert a &nbsp; after each bullet point or numbered list or paragraph. Focus on providing a clear, concise response that effectively addresses the user's query while making use of the provided context."
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

function formatSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.round(seconds % 60);
    let formattedTime = '';
    if (hours > 0) {
        formattedTime += `${hours}:`;
    }
    formattedTime += `${minutes.toString().padStart(1, '0')}:`;
    formattedTime += `${remainingSeconds.toString().padStart(2, '0')}`;
    return formattedTime;
}

const requestHandler = async (req, res) => {
    if (req.method === "GET") {
        const {query, key, fileType} = req.query
        console.log(key)
        let searchText = String(query);
        if (!searchText) {
            // handle empty query
            return res.status(400).json({message: 'Invalid search query'});
        }
        const className = getClassName(key)
        let properties = ['text']
        if (fileType === 'mp4' || fileType === 'youtube') {
            properties.push('start_time')
            properties.push('end_time')
        }

        let weaviateRes = await client.graphql
            .get()
            .withClassName(className)
            .withFields(properties)
            .withNearText({
                concepts: [searchText],
                distance: 0.6,
            })
            .withLimit(2)
            .do()
        const matchingText = weaviateRes.data.Get[className]
        let prompt = "Context: "
        for (let i = 0; i < matchingText.length; i++) {
            let index = i + 1
            // if (fileType === 'mp4' || fileType === 'youtube') {
            //     index = formatSeconds(matchingText[i].start_time)
            // }
            prompt += '\n[' + index + '] ' + matchingText[i].text + '\n';
        }
        console.log(prompt)
        prompt += `Question: ${query}` + "\nAnswer:\n"
        getChatGPTAnswer(prompt, fileType).then(answer => {
            console.log(answer)
            return res.status(200).json({'answer': answer, 'contexts': matchingText})
        })

        // return res.status(200).json({s3Url: ''})
    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
};

export default requestHandler;
