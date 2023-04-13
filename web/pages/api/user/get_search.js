const weaviate = require("weaviate-client");
const OPEN_AI_KEY = "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"
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

const getClassName = (key) => {
    return `Document_${key.replaceAll('-', '_')}`
}

async function getChatGPTAnswer(prompt, fileType) {
    let contextStyle = 'from a pdf'
    if (fileType === 'url') {
        contextStyle = 'from a website'
    } else if (fileType !== 'pdf') {
        contextStyle = 'from the transcripts of a video'
    }
    try {
        let response = await openai.createChatCompletion(
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        "role": "system",
                        "content": `You are an AI assistant that can provide answers to questions based on the provided context, which consists of chunks of text ${contextStyle}. When answering the question, make sure to indicate the source of the information by including the chunk's reference number in brackets, like {1} or {2}. If you are citing multiple contexts for one sentence use the following format {1}{2}{3}.  Your answers must include the appropriate indicators for each chunk of context used to compose your response.\n` +
                            "\n" +
                            "Craft a well-structured, informative which may include bullet points, numbered lists, and other formatting elements to enhance readability and presentation. Insert a &nbsp; after each bullet point or numbered list or paragraph. Focus on providing a clear, concise response that effectively addresses the user's query while making use of the provided context."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature: 0
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

const getRelatedTopics = async (topic) => {
    const prompt = `Topic: ${topic}\n Represent the list of related concepts in the following format: 
[\"first concept\", \"second concept\", \"third concept\"]\n Related Concepts: [`
    try {
        let response = await openai.createChatCompletion(
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        "role": "system",
                        "content": "Please provide three related concepts that will help someone learn everything about the given topic. If the topic is invalid or inappropriate. Return just an empty list. Represent the list of concepts in the following format: \n" +
                            "[\"first concept\", \"second concept\", \"third concept\"]"
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature: 0
            }
        )
        let output = '[' + response.data.choices[0]['message']['content']
        return JSON.parse(output);
    } catch (error) {
        console.log(error);
        return [topic];
    }
}

async function getChatGPTLearn(topic, fileType, key) {
    let contextStyle = 'from a pdf'
    if (fileType === 'url') {
        contextStyle = 'from a website'
    } else if (fileType !== 'pdf') {
        contextStyle = 'from the transcripts of a video'
    }
    let relatedTopics = await getRelatedTopics(topic)
    const results = await Promise.all(
        relatedTopics.map(concept => getEmbeddingContext(concept, key, fileType))
    );
    console.log(relatedTopics)
    const finalContexts = [];
    const contextTextSet = new Set()
    let indexArray = Array(relatedTopics.length).fill(0); // Initialize an index array to keep track of the current index for each result

    while (finalContexts.length < 3) {
        for (let i = 0; i < results.length; i++) {
            const dictionaries = results[i];
            const currentIndex = indexArray[i];

            if (currentIndex < dictionaries.length) {
                const text = dictionaries[currentIndex].text;

                // Check if the text already exists in the finalContexts
                if (!contextTextSet.has(text)) {
                    finalContexts.push(dictionaries[currentIndex]);
                    // Break the loop if 4 final contexts are already selected
                    if (finalContexts.length === 3) {
                        break;
                    }
                }
                // Increment the index for the current result
                indexArray[i]++;
            }
        }
    }
    let prompt = "Context: "
    for (let i = 0; i < finalContexts.length; i++) {
        let index = i + 1
        prompt += '\n[' + index + '] ' + finalContexts[i].text + '\n';
    }
    prompt += `Topic The User Wants to Learn about: ${topic}` + "\nExplanation:\n"
    try {
        let response = await openai.createChatCompletion(
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        "role": "system",
                        "content": `You are an AI assistant that can help users learn more about a topic based on the provided context, which consists of chunks of text ${contextStyle}. Your goal is to explain concepts in-depth, break down tough ideas, and use easy-to-understand language. When presenting information, make sure to indicate the source of the information by including the chunk's reference number in brackets, like {1} or {2}. If you are citing multiple contexts for one sentence use the following format {1}{2}{3}. Your explanations must include the appropriate indicators for each chunk of context used to compose your response.\n` +
                            "\n" +
                            "Craft a well-structured, informative explanation which may include bullet points, numbered lists, and other formatting elements to enhance readability and presentation. Insert a &nbsp; after each bullet point or numbered list or paragraph. Focus on providing a clear, concise response that effectively helps the user learn more about the topic while making use of the provided context. Ensure that you break down complex concepts into simpler terms and use easy-to-understand language to make the learning process more accessible and enjoyable for the user."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature: 0
            }
        )
        console.log(response)
        const output = response.data.choices[0]['message']['content']
        return {'answer': output, 'contexts': finalContexts};
    } catch (error) {
        console.log(error);
        return null;
    }
}


async function getEmbeddingContext(searchText, key, fileType) {
    try {
        const response = await fetch(process.env.BACKEND_URL + '/query_to_embedding', {
            method: 'POST',
            body: JSON.stringify({
                query: searchText
            }),
            headers: {
                'X-API-Key': process.env.CB_API_SECRET,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json(); // Parse the JSON response
        const embeddingString = data.embedding; // Extract the `embedding` value from the response
        const embeddingArray = Array.from(embeddingString); // Parse the embedding string to an array
        const className = getClassName(key)
        let properties = ['text']
        if (fileType === 'mp4' || fileType === 'youtube') {
            properties.push('start_time')
            properties.push('end_time')
        } else if (fileType === 'pdf') {
            properties.push('start_page')
        }
        let weaviateRes = await client.graphql
            .get()
            .withClassName(className)
            .withFields(properties)
            .withNearVector({
                vector: embeddingArray
                // distance: 0.6,
            })
            .withLimit(3)
            .do()
        return weaviateRes.data.Get[className]
    } catch (error) {
        console.error('API request error:', error);
        return null; // Return null if an error occurred
    }
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
        const {query, key, fileType, questionTagSelected} = req.query
        console.log(key)
        let searchText = String(query);
        if (!searchText) {
            // handle empty query
            return res.status(400).json({message: 'Invalid search query'});
        }


        if (questionTagSelected === 'q&a') {
            const matchingText = await getEmbeddingContext(searchText, key, fileType)
            let prompt = "Context: "
            for (let i = 0; i < matchingText.length; i++) {
                let index = i + 1
                prompt += '\n[' + index + '] ' + matchingText[i].text + '\n';
            }
            console.log(prompt)
            prompt += `Question: ${query}` + "\nAnswer:\n"
            const answer = await getChatGPTAnswer(prompt, fileType)
            return res.status(200).json({
                'answer': answer,
                'contexts': matchingText,
                questionTagSelected,
                query,
                fileType,
                key,
            })
        } else {
            const answer = await getChatGPTLearn(searchText, fileType, key)
            return res.status(200).json({
                ...answer,
                questionTagSelected,
                query,
                fileType,
                key,
            })
        }
    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
};

export default requestHandler;
