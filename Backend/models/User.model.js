const mongoose = require("mongoose");

//schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture:{
      type : String  // url
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    batch : {
        type : String,
        required : true
    },
    isInstructor : {
        type : Boolean,
        required : true
    },
    centerLocation : {
        type :String,  // hyd,pune,chennai,bengaluru,noida
        required : true
    },
    courseType : {
        type : String, // MERN,JAVA,DA
        required : true
    },
    isPlaced : {
      type: Boolean,
      required : true,
    },
    organizationName : {
   type :String,
    },
   role : {
    type :String,
   }, 
  },
  { timestamps: true }
);

//Modal
const User = mongoose.model("User" , userSchema);

module.exports = User