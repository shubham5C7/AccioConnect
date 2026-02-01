const express = require("express");
const {getUploadUrl,getSignedImageUrl} = require("../controllers/s3Upload.controller")

const uploadRouter = express.Router();


uploadRouter.post("/uploadFile",getUploadUrl);

// uploadRouter.post("/getSignedUrl", getSignedImageUrl);

module.exports = uploadRouter;
