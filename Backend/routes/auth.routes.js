const express = require("express");
const {signUp, signIn} = require('../controllers/user.controller')
const authRouter = express.Router()


//signUp
// Signup with profile picture upload
// "profilePicture" is the field name from the frontend FormData
authRouter.post('/signUp',signUp)

// signIn
authRouter.post('/signIn',signIn)

module.exports = authRouter;