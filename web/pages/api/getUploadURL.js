import AWS from 'aws-sdk'
import { getServerSession } from "next-auth/next"
import { getSession } from "next-auth/react"
import { authOptions } from 'pages/api/auth/[...nextauth]'



const S3_BUCKET=process.env.AWS_UPLOAD_BUCKET;
const REGION =process.env.AWS_REGION;
const URL_EXPIRATION_TIME = 60; // in seconds

const myBucket = new AWS.S3({
    accessKeyId:process.env.AWS_ACCESS_ID,
    secretAccessKey:process.env.AWS_ACCESS_KEY,
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

function generatePreSignedPutUrl( fileName , fileType) {
    let result = myBucket.getSignedUrlPromise('putObject', {
        Key: fileName,
        ContentType: fileType,
        Expires: URL_EXPIRATION_TIME,
    }).then((url)=> {return url} )
    return result
}

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  const body = req.body;
  if (session) {
    // Signed in
    if (req.method == 'POST') {
      //First, validate the data and send back an error message if data is invalid
      if (body["fileName"] == null) {
        res.status(400)
        res.json({ "Error": "Please add a filename" })
      }
      else if (body["fileType"] != "application/pdf") {
        res.status(400)
        res.json({ "Error": "Please only upload pdf files" })
      }
      else {
        //S3
        await generatePreSignedPutUrl(body["fileName"], body["fileType"]).then((url) => {
            res.status(200)
            res.json({"signedUrl": url})
        })
      }
    } else {
      res.status(400)
      res.json({ "Error": "This endpoint only accepts POST" })
    }
  } else {
    // Not Signed in
    res.status(401)
    res.json({ "Error": "No authentication" })
  }
  res.end()
}

