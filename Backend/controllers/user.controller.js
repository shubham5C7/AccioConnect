const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const writeLog = require("../utils/Logs/Logs");
const LoginHistory = require("../models/UserHistory.model");
const UAParser = require("ua-parser-js");

const DEFAULT_AVATAR =
  "https://somaaccioconnect.s3.ap-south-2.amazonaws.com/defaults/default.png";

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

const signUp = async (req, res, next) => {
  const body = req.body;
  const { batch, centerLocation, courseType } = req.body;

  if (!body.email) return res.err(400, "Email is required");
  if (!All_Batch[batch]) return res.err(400, "Given Batch doesn't exist");
  if (!LOCATIONS.includes(centerLocation)) return res.err(400, "Given Location doesn't exist");
  if (!COURSE_TYPE.includes(courseType)) return res.err(400, "Given CourseType doesn't exist");
  if (!body.password) return res.err(400, "Password is required");

  try {
    const userExists = await User.findOne({ email: body.email });
    if (userExists) return res.err(400, "User already exists");

    const hashedPassword = await bcrypt.hash(body.password, 10);

    let isInstructorBool = false;
    if (body.isInstructor !== undefined) {
      if (typeof body.isInstructor === "string") {
        isInstructorBool = body.isInstructor === "Instructor";
      } else {
        isInstructorBool = Boolean(body.isInstructor);
      }
    }

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
      isInstructor: isInstructorBool,
      isPlaced: body.isPlaced || false,
    });

    if (newUser) {
      const userResponse = newUser.toObject();
      delete userResponse.password;
      res.success(201, "User created successfully", userResponse);
      writeLog("SignUp", {
        email: userResponse.email,
        name: userResponse.firstName,
        batch: userResponse.batch,
        centerLocation: userResponse.centerLocation,
        courseType: userResponse.courseType,
        isInstructor: userResponse.isInstructor,
        isPlaced: userResponse.isPlaced,
        phoneNumber: userResponse.phoneNumber,
      });
    }
  } catch (err) {
    next(err);
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) return res.err(404, "Please provide the Email");

  try {
    let user = await User.findOne({ email });
    if (!user) return res.err(404, "User is not Found");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return next({ status: 401, message: "Incorrect Password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("accioConnect-token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    const parser = new UAParser(req.headers["user-agent"]);
    const ua = parser.getResult();

    const lat = req.body.lat || null;
    const lng = req.body.lng || null;
    let city = "Unknown";
    let country = "Unknown";

    if (lat && lng) {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          { headers: { "User-Agent": "AccioConnect/1.0" } }
        );
        const geoData = await geoRes.json();
        city = geoData.address?.city
          || geoData.address?.town
          || geoData.address?.village
          || geoData.address?.state_district
          || "Unknown";
        country = geoData.address?.country || "Unknown";
      } catch (err) {
        console.log("Geo lookup failed", err.message);
      }
    }

    const recentLogin = await LoginHistory.findOne({ userId: user._id })
      .sort({ createdAt: -1 });
    const fiveSecondsAgo = new Date(Date.now() - 5000);

    if (!recentLogin || recentLogin.createdAt < fiveSecondsAgo) {
      await LoginHistory.create({
        userId: user._id,
        device: ua.device.type || "desktop",
        browser: ua.browser.name || "Unknown",
        os: ua.os.name || "Unknown",
        ip: req.ip,
        location: { lat, lng, city, country },
      });
    }

    res.success(200, "ok", { user: safeUser });
    writeLog("SignIn", { email: safeUser.email });

  } catch (err) {
    next(err);
  }
};

const getLoginHistory = async (req, res) => {
  try {
    const history = await LoginHistory.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.success(200, "ok", history);
  } catch (err) {
    res.err(500, "Failed to fetch history");
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("accioConnect-token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.success(200, "Logged out successfully");
  } catch (err) {
    return res.err(500, "Logout failed");
  }
};

const profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id, "-password");
    res.success(200, "ok", user);
  } catch (err) {
    next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.err(401, "User not authenticated");

    const { firstName, lastName, role, isPlaced, organizationName, profilePicture, password } = req.body;

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

    const user = await User.findById(userId);
    if (!user) return res.err(404, "User is not found");

    if (firstName !== undefined) {
      if (typeof firstName !== "string" || !firstName.trim())
        return res.err(400, "firstName must be a non-empty string");
      user.firstName = firstName.trim();
    }

    if (lastName !== undefined) {
      if (typeof lastName !== "string" || !lastName.trim())
        return res.err(400, "lastName must be a non-empty string");
      user.lastName = lastName.trim();
    }

    if (role !== undefined) {
      if (typeof role !== "string") return res.err(400, "role must be a string");
      user.role = role;
    }

    if (isPlaced !== undefined) {
      const parsedIsPlaced = typeof isPlaced === "string" ? isPlaced === "true" : isPlaced;
      if (typeof parsedIsPlaced !== "boolean") return res.err(400, "isPlaced must be a boolean");
      user.isPlaced = parsedIsPlaced;
      if (!parsedIsPlaced) user.organizationName = "";
    }

    if (organizationName !== undefined) {
      if (typeof organizationName !== "string") return res.err(400, "organizationName must be a string");
      user.organizationName = organizationName.trim();
    }

    if (profilePicture !== undefined) {
      if (typeof profilePicture !== "string") return res.err(400, "profilePicture must be a URL string");
      user.profilePicture = profilePicture;
    }

    if (password !== undefined) {
      if (typeof password !== "string" || password.length < 6)
        return res.err(400, "Password must be at least 6 characters long");
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    return res.success(200, "User profile updated successfully", userResponse);

  } catch (err) {
    console.error("UPDATE ERROR NAME:", err.name);
    console.error("UPDATE ERROR MSG:", err.message);
    next(err);
  }
};

module.exports = { signUp, signIn, logout, profile, updateUserProfile, getLoginHistory }