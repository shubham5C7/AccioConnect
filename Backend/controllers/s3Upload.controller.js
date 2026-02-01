const {PutObjectCommand, GetObjectCommand} = require("@aws-sdk/client-s3")
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");
const client = require("../config/s3");


const getUploadUrl = async(req,res)=>{
    const {fileName,mimeType,contentType} = req.body;

    if(!fileName || !mimeType || !contentType){
      return res.err(400, "FileName and ContentType ,mimeType is Required ");
    }
    
    try{

        const key =`uploads/${Date.now()}-${fileName}`;

        const command= new PutObjectCommand({
            Bucket:process.env.AWS_BUCKET,
            Key:key,
            ContentType :mimeType,
        });

        const url = await getSignedUrl(client,command,{expiresIn:120})
        if(url){
              return res.success(200, "Presigned URL generated", { 
      url, 
      key, 
      contentType,
      mimeType 
    });
        }
    }catch(err){
        return res.err(500,err.message  || "Failed to generate upload URL");
    }
}


// const CreatePost = async(req,res)=>{
//     const {key,caption,contentType} = req.body;

//     if(!key ||  !contentType){
//         res.err(400,"Key/Path and type of file is Required")
//     }
    
//     const currentPost={
//         id:Math.random(),
//         path:key,
//         caption,
//         contentType,
//         createdAt:Date.now()
//     }
//     // REPLACE it with actual DB save

//     res.status(200).json({message:"Post created",post:currentPost});
// }


// const getUrlFromS3 = async(req,res)=>{
//     const postId = req.params.postId;

//     if(!postId){
//         return res.err(400,"PostId is required");
//     }

//     try{
//      const requestPost = new GetObjectCommand({
//         Bucket:process.env.AWS_BUCKET,
//         Key:requestPost[0].path
//      })


//      const url=await getSignedUrl(client,command,{expiresIn:3600});

//      if(url){
//         res.sucess(200,{message:"Success",url:url})
//      }

//     }catch(err){
//        console.log(err)
//        return res.err(500,err.message||"Unable to Generate Url from S3")
//     }
// }

module.exports ={getUploadUrl}