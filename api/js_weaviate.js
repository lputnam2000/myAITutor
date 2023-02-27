const weaviate = require("weaviate-client");
const OPEN_AI_KEY = "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"

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

client
  .schema
  .getter()
  .do()
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.error(err)
  });