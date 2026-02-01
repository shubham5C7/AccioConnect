const express = require("express");
const {profile,updateUserProfile} = require('../controllers/user.controller')
const authorize = require('../middlewares/auth')
const userRouter = express.Router()


// profile
userRouter.get('/profile',authorize,profile)

// update user profile
userRouter.patch("/update",authorize,updateUserProfile);

module.exports = userRouter;