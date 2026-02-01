const jwt = require("jsonwebtoken");

// Authorisation middleware
function authorize(req,res,next){
 try{ 
     // Get token from cookie
   const token = req.cookies["accioConnect-token"];

   // Check token is not found
   if(!token){
   return res.status(401).json({ success: false, message: "Token not found" });
   }
   console.log(token,"JWT token")
   
  //Verify token from JWT(jwt.verify(token,secretKey))
  const verifiedToken = jwt.verify(token,process.env.JWT_SECRET_KEY );

  // Check the verifiedtoken is Existed or not 
  if(!verifiedToken){
       return res.err(403,"Token is not valid")
  }

  // Attach it to request 
  req.user = verifiedToken

 //Move next
  next()
   }catch(err){
       return res.status(403).json({ success: false, message: "Token is not valid" });
   }
}

module.exports = authorize