const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SignUpLogs = require("../utils/Logs/SignUpLogs");

const DEFAULT_AVATAR = "https://somaaccioconnect.s3.ap-south-2.amazonaws.com/defaults/default.png";


const All_Batch = {
  OBH_1: "OBH_1",
  OBH_2: "OBH_2",
  OBH_3: "OBH_3",
  OBH_4: "OBH_4",
  OBH_5: "OBH_5",
  OBH_6: "OBH_6",
  OBH_7: "OBH_7",
  OBH_8: "OBH_8",
  OBH_9: "OBH_9",
};

const LOCATIONS = ["hyderabad", "pune", "chennai", "noida", "bengaluru"];

const COURSE_TYPE = ["mern", "java", "da"];

//SignUp
const signUp = async (req, res, next) => {
  const body = req.body;

  const { batch, centerLocation, courseType } = req.body;

  // Verify the email is existed in Accio DataBase
  if (!body.email) {
    return res.err(400, "Email is required");
  }

  // Verify batch in the system
  if (!All_Batch[batch]) {
    return res.err(400, "Given Batch doesn't exist");
  }

  // Verify location in the system
  if (!LOCATIONS.includes(centerLocation)) {
    return res.err(400, "Given Location doesn't exist");
  }

  // Verify course type
  if (!COURSE_TYPE.includes(courseType)) {
    return res.err(400, "Given CourseType doesn't exist");
  }
  console.log(body);

  // If password not filled
  if (!body.password) {
    return res.err(400, "Password is required");
  }

  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    console.log(hashedPassword, "hashed password");

    const userExists = await User.findOne({ email: body.email });

    if (userExists) {
      return res.err(400, "User already exists");
    }

    // create a new user in the database
    const newUser = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      password: hashedPassword,
      profilePicture: body.profilePicture || DEFAULT_AVATAR,
      batch: body.batch,
      centerLocation: body.centerLocation,
      courseType: body.courseType,
      isInstructor: body.isInstructor || false,
      isPlaced: body.isPlaced || false,
    });

    if (newUser) {
      console.log("its in the new USer");
      // Don't send password back to frontend
      const userResponse = newUser.toObject();
      delete userResponse.password;

      res.success(201, "User created successfully",userResponse);

      await SignUpLogs(userResponse);
    }
  } catch (err) {
    next(err);
  }
};

// SignIn
const signIn = async (req, res, next) => {
   console.log(req.body,"req.body"); 
  const { email, password } = req.body;

  // checks whether the client sent required input
  if (!email) {
    return res.err(404, "Please provide the Email");
  }

  try {
    // Find the  email in the database
    let user = await User.findOne({ email });

    // checks whether a valid user exists in the database for that input.
    if (!user) {
      return res.err(404, "User is not Found");
    }

    // Check the user password and the database password is similar
    const isValidPassword = await bcrypt.compare(password, user.password);

    // Check if the Password is not correct
    if (!isValidPassword) {
      return next({ status: 401, message: "Incorrect Password" });
    }
    // Create  a JWt token
    const token = jwt.sign(
      //Calls jwt.sign() to generate a JSON Web Token
      { id: user._id, email: user.email }, //  Stores user information inside the token
      process.env.JWT_SECRET_KEY, //Used to sign and protect the token, cannot be modified or forged
      { expiresIn: "7d" } // means the token is valid for 7 days
    );

    console.log(token, "token generated from jwt");

    // Store the JWT in an HTTP-only cookie so JavaScript cannot read it
    res.cookie("accioConnect-token", token, {
      httpOnly: true, // HttpOnly keeps the token hidden from JavaScript, protecting it from XSS(Cross-Site Scripting) attacks.
      secure: false, // the cookie can be sent over HTTP (not just HTTPS), which is useful for local development.
      sameSite: "lax", // allows cross-site cookie sending but requires HTTPS and extra CSRF (Cross-Site Request Forgery) protection.
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    console.log("step 3 worked fine");

    // Remove the password before sending response
    const safeUser = user.toObject();
    delete safeUser.password;

    // call is Success
    res.success(200, "ok", {
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

// Profile
const profile = async (req, res, next) => {
  try {
    // find user by id take it from authorize
    const user = await User.findById(req.user.id, "-password"); // mangoos expect this data it will give all data
    // Return the user deatils but not password
    res.success(200, "ok", user);
  } catch (err) {
    next(err);
  }
};

// Update apis for User (isPlaced, organization name, role, password, profilePicture, firstName and lastName)
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.err(401, "User not authenticated");
    }

    const {
      firstName,
      lastName,
      role,
      isPlaced,
      organizationName,
      profilePicture,
      password,
    } = req.body;

    // At least one field required
    if (
      firstName === undefined &&
      lastName === undefined &&
      role === undefined &&
      isPlaced === undefined &&
      organizationName === undefined &&
      profilePicture === undefined &&
      password === undefined
    ) {
      return res.err(400, "At least one field must be provided for update");
    }
    // Find the user by userId
    const user = await User.findById(userId);
    // Check the user is exist or not
    if (!user) {
      return res.err(404, "User is not found");
    }

    // Validation for updates
    if (firstName !== undefined) {
      if (typeof firstName !== "string" || !firstName.trim()) {
        return res.err(400, "firstName must be a non-empty string");
      }
      user.firstName = firstName.trim();
    }

    if (lastName !== undefined) {
      if (typeof lastName !== "string" || !lastName.trim()) {
        return res.err(400, "lastName must be a non-empty string");
      }
      user.lastName = lastName.trim();
    }

    if (role !== undefined) {
      if (typeof role !== "string") {
        return res.err(400, "role must be a  string");
      }
      user.role = role;
    }

    if (isPlaced !== undefined) {
      if (typeof isPlaced !== "boolean") {
        return res.err(400, "isPlaced must be a  boolean");
      }
      user.isPlaced = isPlaced;

      if (!isPlaced) {
        user.organizationName = "";
      }
    }

    if (organizationName !== undefined) {
      if (typeof organizationName !== "string") {
        return res.err(400, "organizationName must be a  string");
      }
      user.organizationName = organizationName.trim();
    }

    if (profilePicture !== undefined) {
      if (typeof profilePicture !== "string") {
        return res.err(400, "profilePicture must be a URL string");
      }
      user.profilePicture = profilePicture;
    }

    if (password !== undefined) {
      if (typeof password !== "string" || password.length < 6) {
        return res.err(400, "Password must be at least 6 characters long");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.success(200, "User profile updated successfully", userResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { signUp, signIn, profile, updateUserProfile };
