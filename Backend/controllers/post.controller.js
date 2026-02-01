const Post = require("../models/Post.model");
const User = require("../models/User.model");

// create a post api
const createPost = async (req, res, next) => {
  //  Get logged-in user from JWT
  const userId = req.user?.id;

  // Check if user is authenticated
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  //  Get post data from body
  const {
    images,
     content,
    caption,
    type,
    isLikeDisable = false,
    isCommentDisable = false,
  } = req.body;
 // Validations
 if(!images || !Array.isArray(images) ||images.length === 0){
  return res.err(400,"AtLeast one image is required")
 }

 if(!type){
  return res.err(400,"Post type is required")
 }

 // Validate each image object
 for(let img of images){
  if(!img.contentType || !img.mimeType || !img.key){
    return res.err(400,"Each image mush have contentType,mimeType and key")
  }
 }


  try {
    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.err(404, "User not found");
    }

    // create a new post
    const newPost = await Post.create({
      user: userId,
      images:images.map(img=>({
        contentType:img.contentType,
        mimeType:img.mimeType,
        key:img.key,
        uploadedAt:new Date()
      })),
       content,
      caption: caption || "",
      type,
      isLikeDisable,
      isCommentDisable,
      likes: [],
      comments: [],
    });

    if (!newPost) {
      return res.err(500, "Post creation failed");
    }

    //  Send response
    if (newPost) {
      return res.success(201, "Post created successfully",newPost);
    }
  } catch (err) {
    next(err);
  }
};

// Create apis for getting all the post
const getAllPost = async (req, res, next) => {
  try {
    console.log(" Fetching all posts...");

    const allPosts = await Post.find()
      .populate("user", "firstName lastName profilePicture ")
      .sort({ createdAt: -1 });

    console.log(" Posts fetched:", allPosts.length);

    if (allPosts) {
      return res.status(200).json({
        success: true,
        message: "All posts fetched successfully",
        data: allPosts,
      });
    }
  } catch (err) {
    console.error(" getAllPost error:", err);
    next(err);
  }
};

//create api to get all posts from given postId
const getPostsByUserId = async (req, res, next) => {
  const {userId }= req.params;
  try {
    // Find the user By postId
    const posts = await Post.find({ user: userId}).sort({createdAt : -1}).populate({"user":"firstName lastName profilePicture"});

    if (!posts || posts.length === 0) {
      return res.err(404, "No posts found for this user");
    }
    return res.success(200, "Posts fetched successfully", posts);
  } catch (err) {
    next(err);
  }
};

// Create apis for getting all referal posts
const getReferralPosts = async (req, res, next) => {
  try {
    //Find the referrals
    const getReferral = await Post.find({ type: "referral-post" });
    // If referrals are not exists
    if (!getReferral || getReferral.length === 0) {
      return res.err(404, "No Referrals found");
    }
    return res.success(200, "Referrals fetched Successfully", getReferral);
  } catch (err) {
    next(err);
  }
};

// Updates the Likes
const UpdateLikes = async (req, res, next) => {
  try {
    // post to like/unlike
    const postId = req.params.postId;
    // user who liked/unliked
    const { userId, userName, profilePicture } = req.body;
    // Check if the user is Exist or Not
    if (!userId || !userName || !profilePicture) {
      return res.err(400, "userId, userName, and profilePicture are required");
    }
 
    if(!postId){
      return res.err(400,"postId is required")
    }

    // Find the post
    const postLikes = await Post.findById(postId);

    if (!postLikes) {
      return res.err(404, "Post not found");
    }

         // Check if likes are disabled
     if(postLikes.isLikeDisable){
      return res.err(403, "Likes are disabled for this post")
     }

    // ensure likes array exists
    postLikes.likes = postLikes.likes || [];

    // Check if the user already liked the post
    const likedIndex = postLikes.likes.findIndex(
      (like) => like.userId === userId
    );

    if (likedIndex === -1) {
      // If not liked, add postId to likes array
      postLikes.likes.push({
         userId, 
        userName,
       profilePic: profilePicture,
      });
    } else {
      // if already liked ,move the postId from the array
      postLikes.likes.splice(likedIndex, 1);
    }
    // save the updated post
    await postLikes.save();

    return res.success(200, "Liked Successfully", postLikes);
  } catch (err) {
    next(err);
  }
};


// Updates the Comments
const UpdateComments = async (req, res, next) => {
  try {
    // post for Comments
    const postId = req.params.postId;

    // user who commented (same pattern as likes)
    const { userId, userName,profilePicture, comment } = req.body;

    // Check the user is Exist or not
    if (!profilePicture || !userName || !userId || !comment) {
      return res.err(400, "postId is required");
    }
      // Find the post
    const postComments = await Post.findById(postId);

    // If the PostComments is not Exists
    if (!postComments) {
      return res.err(404, "Post is Not Found");
    }

    if(postComments.isCommentDisable){
      return res.success(403,"Comments are disabled for this post")
    }

      // Ensure comments array exists
    postComments.comments = postComments.comments || [];
    

    // Check user hasn't commented ,add the comment
      postComments.comments.push({
         userId,
        userName,
        profilePic:profilePicture,
        comment,
        createdAt: new Date()
      });

    // Save the updated post
    await postComments.save();

    return res.success(200, "Post comments updated", postComments);
  } catch (err) {
    next(err);
  }
};


// Crete api for Edit the Comment
const EditComment = async(req,res,next) =>{
  try{

    console.log("api working")

    console.log(req.body,'request body')

    if(!req.body){
      return res.err(400,"Bad request")
    }
  // post for Comments
  const postId = req.params.postId;

  const commentId = req.params.commentId;
   const { comment } = req.body;
    const userId = req.user?.id;

// Check the userID  is exist
 if(!userId ){
   return res.err(401,"User not authenticated");
  }
// Check the  comment is exist
   if(!comment){
   return res.err(401,"comment is required");
  }
  //Find the post
  const post = await Post.findById(postId)

  //Check if the post is Exist
  if(!post){
    return res.err(404,"Post is not Found")
  }

  //Check if the comment is disable
  if(post.isCommentDisabled){
    return res.err(403,"Comments are disabled for this post")
  }

// Find Specific Comment
const commentIdx = post.comments.findIndex((comment)=>comment._id.toString() === commentId);

  console.log(commentIdx,"commenstIdx")

if (commentIdx === -1) {
  return res.err(404, "Comment not found or you are not the owner");
}

//Check if the comment is the user comment
if(post.comments[commentIdx].userId.toString()  !== userId){
  return res.err(403,"You can only Edit your comment")
}

post.comments[commentIdx].comment = comment;
post.comments[commentIdx].updatedAt = new Date();
 await post.save();

 return res.success(200,"Comment Updated Successfully",post);
}catch(err){
  next(err);
}
}

// Check api for Delete comments
const DeleteComment = async(req,res,next)=>{
  try{
  const {postId ,commentId} = req.params
  const userId = req.user?.id;

// Check the userID  is exist
  if(!userId ){
   return res.err(401,"User not authenticated");
  }

  if (!postId || !commentId) {
  return res.status(400, "Post ID and Comment ID are required");
}
    // Find the post by Id
  const post=await Post.findById(postId);
// Check if te post is Exist or not
  if(!post){
      return res.err(404, "Post is not Found");
}
// Find Specific Comment
const commentIdx = post.comments.findIndex((comment)=>comment._id.toString() === commentId);

// Check the commentIdx is Empty or not
if(commentIdx === -1){
  return res.err(404,"Comment not found");
}

// Check the user is Allowed to delete the comment
if(post.comments[commentIdx].userId.toString() !== userId){
    return res.err(403,"You can only Delete your comment")
}

// Remoeve the comment from  the array
post.comments.splice(commentIdx,1)

// Save the post
    await post.save();

    return res.success(200,"Comment deleted successfully",post.comments)
  }catch(err){
    next(err)
  }
}

// Create api for delete post
const DeletePost = async (req, res, next) => {
  try {

    const postId = req.params.postId;
    const userId = req.user.id; // Get from authenticated user via middleware

    // Find the post by Id
    const post = await Post.findById(postId);

    // Check the user is Exist or not
    if (!post) {
      return res.err(404, "Post is not Found");
    }

    // Check if the user is allowed to delete
    if (post.user.toString() !== userId.toString()) {
      return res.err(403, "You are not allowed to delete this post");
    }
    // Delete the user by Id
    const deletePost = await Post.findByIdAndDelete(postId);

    return res.success(200, "Delete the post Successfully", deletePost);
  } catch (err) {
    next(err);
  }
};

// Create api for post (caption, isLikeDisabled, isCommentDisabled)
const UpdatePost = async(req,res,next) =>{
  try{
 const {postId} = req.params;
 const { caption, isLikeDisabled, isCommentDisabled } = req.body;
 const userId = req.user?.id;

 // Check the userID  is exist
 if(!userId ){
   return res.err(401,"User not authenticated");
  }

    // Check if at least one field was provided
  if(caption === undefined && isLikeDisabled === undefined && isCommentDisabled === undefined){
    return res.err(400,"At least one field must be provide for update")
  }

  
   // Find the post
   const post =await Post.findById(postId);

   // Check the post is exist or not 
   if(!post){
    return res.err(404,"Post not found");
   }

   // Check the user can edit teh post
     if (!post.user || post.user.toString() !== userId) {
      return res.err(403, "You cannot update the post");
    }


   // Validation to update caption
   if(caption !== undefined){
    if(typeof caption !== 'string' || caption.trim().length === 0){
      return res.err(400,"Caption must be non-empty String")
    }
    post.caption = caption.trim();
   }

   // Validation to updata like Setting
   if(isLikeDisabled !== undefined){
    if(typeof isLikeDisabled !== "boolean"){
      return res.err(400,"isLikeDisable must be boolean")
    }
    post.isLikeDisabled = isLikeDisabled; 
   }

  // Validation to updata comment Setting
  if(isCommentDisabled !== undefined){
    if(typeof isCommentDisabled !== "boolean"){
      return res.err(400,"isCommentDisable must be boolean");
    }
    post.isCommentDisabled = isCommentDisabled;
  }

  // Save the post
    await post.save()

    return res.success(200,"Post updated successfully",post)
  }catch(err){
    next(err)
  }
}



module.exports = {
  createPost,
  getAllPost,
  getPostsByUserId,
  getReferralPosts,
  UpdateLikes,
  UpdateComments,
  EditComment,
  DeleteComment,
  DeletePost,
  UpdatePost,
};



/*


Backend
Day 1 (Wed, 17 Dec) :  Clone repo and understand the complete code flow and SignIn Api should send token in response, create atleast one api for creating post

Day 2 (Thursday, 18 Dec) :  Create apis for getting all the post, create api to get all posts from given userId

Day 3 (Friday, 19 Dec) : Create apis for getting all referal posts, api to update like and comment 

Day 4 (Saturday, 20 Dec) : Create api for delete post 


Front end  and Back end 
Day 6 (Monday, 22 Dec) : Create front for sign up, sign in (With UI as well as working forms and working APIs), store token after signIn in local storage

Day 7 (Tuesday, 23 Dec) :  Create a home page With headers, sidebar (Create Post : A pop up should appear and ask the details to create posts take details from posts model then call create post api)

Day 8 (Wednesday, 24 Dec) :   Complete  create post, and the rest of the flow of application.

Day 9 (Thursday, 25 Dec) : Call all posts api and display in home section, Display likes and comments from collection, implement like and comment functionality from front end side and call APIs for both

Day 10 (Friday, 26 Dec) : Once click on profile redirct to profile page, Call User Profile and Posts from user Id on page load and render it on the page

Day 11 (Saturday, 27 Dec) : Update apis for Post (Caption, isLikeDisabled, isCommenct Disabled), Update apis for User (isPlaced, organization name, role, password, profilePicture, firstName and lastName)

Day 12 (Sunday, 28 Dec) : Complete the flow, Check everything is working without errors, Figure out how Accio Connect can give experience of serving different purpose than other platforms.
                          ex: LinkedIn serve different purpose and Instagram serve different purpose but still both platforms have almost similer features. Similarly figure out how Accio-Connect should serve purpose for connecting with Accio


*/
