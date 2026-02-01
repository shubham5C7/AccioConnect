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

const PORT = process.env.PORT

const app = express();

dotEnv.config()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));  // it allows the cookies and authentication tokens and headers to sent b/w FE and BE
app.use(express.json());  // Parses JSON data
app.use(express.urlencoded({ extended: true })); // Parses form data
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
      data: { data },
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

// Call routers
app.use('/auth',authRouter)
app.use('/user', userRouter);
app.use('/posts',postRouter);
// app.use("/upload",uploadRouter); // Uploads Routers


// Error-handling  middleware
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.err(err.status || 500, err.message || "Internal Server Error");
   // next();
});

app.listen(PORT, () => console.log(`Server is running  on port ${PORT}`));
