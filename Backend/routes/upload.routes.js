const express = require("express");
const {getUploadUrl, getUrlFromS3,deleteUserAndImage} = require("../controllers/s3Upload.controller")
const authorize = require("../middlewares/auth");

const uploadRouter = express.Router();


uploadRouter.post("/uploadFile",getUploadUrl);

uploadRouter.get("/getFile/:postId", getUrlFromS3);

uploadRouter.delete("/deleteUser", authorize,deleteUserAndImage)

module.exports = uploadRouter;
