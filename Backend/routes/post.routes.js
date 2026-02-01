const express = require('express')
const authorize = require('../middlewares/auth')
const {createPost, getAllPost, getPostsByUserId, getReferralPosts, UpdateLikes, UpdateComments,EditComment,DeleteComment, DeletePost,UpdatePost} = require("../controllers/post.controller")


const postRouter = express.Router();

// One Post
postRouter.post("/createpost",authorize,createPost);

// All posts
postRouter.get('/allposts',getAllPost)

// Get all posts by userId
postRouter.get('/post/:userId',getPostsByUserId)

//Get the Referrals Posts
postRouter.get('/referralposts',getReferralPosts)

// Get the post liked or not
postRouter.patch('/likes/:postId',authorize,UpdateLikes)

// Get the post commented or not
postRouter.patch('/comments/:postId',authorize,UpdateComments)

// Get the post for edit comment
postRouter.patch('/:postId/comments/:commentId',authorize,EditComment)

// Delete the comment
postRouter.delete('/:postId/comments/:commentId',authorize,DeleteComment )

// Delete post
postRouter.delete('/deletePost/:postId',authorize,DeletePost)

//Updated apis for Post (Caption, isLikeDisabled, isCommenct Disabled)
postRouter.patch('/:postId',authorize,UpdatePost)

module.exports = postRouter;