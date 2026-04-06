const { PutObjectCommand, GetObjectCommand ,DeleteObjectCommand} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const client = require("../config/s3");
const Post = require("../models/Post.model");
const User = require("../models/User.model");
const writeLog = require("../utils/Logs/Logs");
const DEFAULT_AVATAR = "https://somaaccioconnect.s3.ap-south-2.amazonaws.com/defaults/default.png";

// Generate presigned URL for uploading files to S3
const getUploadUrl = async (req, res) => {
  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {

  return res.err(400,"fileName and fileType are required")
  }

  try {
 
    const key = `uploads/${Date.now()}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      ContentType: fileType,
      
    });
   // Temporary signed URL for UPLOADING (expires in 2 minutes)
    const uploadUrl= await getSignedUrl(client, command, { expiresIn: 120 });

    // Permanent URL (Virtual Hosted Style)
     const permanentUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;


    return res.success(200,"Presigned URL generated",{
      key,
      uploadUrl,
      permanentUrl, // SAVE THIS IN DB
    });

  } catch (err) {
    return res.err(500,{message:err.message || "Failed to generate upload URL"})
  }
};

// Get presigned URL to view/download image from S3 Fetches post from DB and generates URL for the stored S3 key
const getUrlFromS3 = async (req, res) => {
  const postId = req.params.postId;

  if (!postId){
    return res.err(400,"PostId is required");
  }

  try {
     // Fetch post from database
    const post = await Post.findById(postId);

    if (!post) {
       return res.err(400,"Post not found");
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: post.content,
      ResponseContentDisposition:"inline",// Display in vrowser instead  of download
    });

    const url = await getSignedUrl(client, command, { expiresIn: 3600 });

    return res.success(200,"URL generated successfully",{url:url, key: post.content })

  } catch (err) {
    return res.err(500,err.message || "Unable to generate URL from S3")

  }
};

const deleteUserAndImage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.err(404, "User not found");

    if (user.profilePicture !== DEFAULT_AVATAR) {
      const key = user.profilePicture.split(".amazonaws.com/")[1];
      await client.send(new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET, // matches your upload controller
        Key: key,
      }));
    }

    await User.findByIdAndDelete(req.user.id);
    writeLog("deleteUserAndImage", { email: user.email });

    res.clearCookie("accioConnect-token");
    res.success(200, "User deleted successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = { getUploadUrl, getUrlFromS3,deleteUserAndImage};

