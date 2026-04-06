const express = require("express");
const {signUp, signIn, logout} = require('../controllers/user.controller')
const { getLoginHistory } = require('../controllers/user.controller'); 
const authorize = require('../middlewares/auth');    
const authRouter = express.Router()


//signUp
// Signup with profile picture upload
// "profilePicture" is the field name from the frontend FormData
authRouter.post('/signUp',signUp)

// signIn
authRouter.post('/signIn',signIn)

authRouter.get("/history", authorize, getLoginHistory);

authRouter.post("/logout", logout);


module.exports = authRouter;