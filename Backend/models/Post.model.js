const mongoose = require('mongoose')
const { profile } = require('../controllers/user.controller')

const postSchema = new mongoose.Schema({
 user:{
   type: mongoose.Schema.Types.ObjectId,  
    ref: "User",
    required : true
 },
 contentType : {
    type : String, // image,video,blog
    required : true
 },
 content : {
       type : String,
    required : true 
 },
 caption:{
    type : String,
 },
 type:{
       type : String, // Rteferal-post or general post
    required : true
 },
 isLikeDisable : {
    type : Boolean,
    default: false,  //  Likes ENABLED by default
 },
 isCommentDisable : {
     type : Boolean,
     default: false,
 },
 likes : [
    {
        profilePic : {type : String , required : true},
        userName : {type : String , required : true},
        userId : {type : String ,required : true}
    }
 ],
 comments : [
    {
        profilePic : {type : String , required : true},
        userName : {type : String , required : true},
        userId : {type : String ,required : true},
        comment : {type :String ,required : true},
        createdAt: { type: Date, default: Date.now }
        
    }
 ],
},{ 
  timestamps: true
})

const Post = mongoose.model('Post',postSchema)

module.exports = Post