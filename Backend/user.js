const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const dotEnv = require("dotenv")
const User = require('./models/User.model');
const userRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");
const authRouter = require("./routes/auth.routes");
const uploadRouter = require("./routes/upload.routes")

dotEnv.config();


const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));  // it allows the cookies and authentication tokens and headers to sent b/w FE and BE
app.use(express.json({ limit: "10mb" }));  // Parses JSON data
app.use(express.urlencoded({ extended: true ,limit: "10mb"})); // Parses form data
app.use(cookieParser());

//Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB Connection failed"));


// Create a Sucess or failuar middleware
app.use((req, res, next) => {
  //Success responce
  res.success = (status, message, data = null) => {
    res.status(status).json({
      success: true,
      message,
      data: data,
    });
  };

  //Error responce
  res.err = (status, message) => {
    res.status(status).json({
      success: false,
      message,
    });
  };
  next();
});


app.get('/test', (req, res) => {
  res.json({ message: "Server is working!" });
});

// Call routers
app.use('/auth',authRouter)
app.use('/user', userRouter);
app.use('/posts',postRouter);
app.use("/upload",uploadRouter); 


// Error-handling  middleware

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  // PayloadTooLarge — happens before res.err is attached, so use res.status directly
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Image too large. Please upload an image under 10MB.",
    });
  }

  // All other errors
  if (typeof res.err === "function") {
    return res.err(err.status || 500, err.message || "Internal Server Error");
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => console.log(`Server is running  on port ${PORT}`));
