
// This object used to communicate with the AWS S3
const {S3Client} = require("@aws-sdk/client-s3");
// tells dotenv to read your .env file and load all key-value pairs into process.env.
require("dotenv").config(); 

// Create new AWS S3 Client 
const client = new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESSKEY,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    }
})
 
module.exports = client;