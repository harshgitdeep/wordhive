const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Ensure required environment variables are set in production
if (process.env.NODE_ENV === "production") {
  if (!process.env.MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined.");
  }
  if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
  }
}

const User = require("./models/User");
const Post = require("./models/Post");

const app = express();
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET || "fallback_jwt_secret";
const uploadMiddleware = multer({ dest: "/tmp" });

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL && process.env.FRONTEND_URL.replace(/\/$/, "")
].filter(Boolean);

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false); // Reject origin gracefully without raising a server-side 500 error
      }
    },
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));


//-------------------------------------------------------
// Cloudinary Configuration
//-------------------------------------------------------

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//-------------------------------------------------------
// MongoDB Connection
//-------------------------------------------------------

let cachedDbConnection = null;

app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  if (!process.env.MONGO_URI) {
    console.error("Database connection failed: MONGO_URI is not defined.");
    return res.status(500).json({
      error: "Configuration Error",
      details: "MONGO_URI environment variable is missing."
    });
  }

  try {
    if (!cachedDbConnection) {
      console.log("Connecting to MongoDB...");
      cachedDbConnection = mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    await cachedDbConnection;
    console.log("Connected to MongoDB successfully");
    next();
  } catch (err) {
    console.error("Database connection failure:", err.message);
    cachedDbConnection = null; // Reset cache on failure
    return res.status(500).json({
      error: "Database connection failed",
      details: err.message
    });
  }
});

//-------------------------------------------------------
// Nodemailer Configuration
//-------------------------------------------------------

async function sendVerificationMail(email_to) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "wordhiveblogs@gmail.com",
      pass: process.env.NODEMAILER_PASS,
    },
  });

  await transporter.sendMail({
    to: email_to,
    from: "wordhiveblogs@gmail.com",
    subject: "Thank You for Registering!",
    html: `
      <p>Welcome to <strong>Word Hive Blogs</strong>!</p>
      <p>Discover and share your thoughts with us.</p>
      <p>Explore topics and articles on our website.</p>
      <p>Have questions? Email us at wordhiveblogs@gmail.com.</p>
      <div style="text-align:center;">
        <a href="https://wordhive.vercel.app/"><img src="https://i.ibb.co/8mSX6F0/loading.gif" alt="loading" style="width:200px;height:auto;display:block;margin:0 auto;"></a>
      </div>
      <p>We're excited to see your blogs!</p>
      <p><strong>Best regards,</strong><br><strong>Team Word Hive Blog</strong></p>
    `,
  });
}

//-------------------------------------------------------
// User Registration and Authentication
//-------------------------------------------------------

app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Check username
    const existingUsername = await User.findOne({
      username: trimmedUsername,
    });

    if (existingUsername) {
      return res.status(400).json({
        error: "Username already taken",
      });
    }

    // Check email
    const existingEmail = await User.findOne({
      email: trimmedEmail,
    });

    if (existingEmail) {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    // Create user
    const userDoc = await User.create({
      username: trimmedUsername,
      password: bcrypt.hashSync(password, salt),
      email: trimmedEmail,
    });

    // Send mail separately
    try {
      await sendVerificationMail(trimmedEmail);
    } catch (mailError) {
      console.log("Mail Error:", mailError);
    }

    // SUCCESS RESPONSE
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (e) {
    console.log("Register Error:", e);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (!userDoc) {
    res.status(400).json("Wrong username or password!");
    return;
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("Wrong username or password");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(200).json(null);
  }
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

//-------------------------------------------------------
// Check Username and Email Availability
//-------------------------------------------------------

app.get("/check-username/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    res.json({ available: !user });
  } catch (error) {
    console.error("Error checking username availability:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/check-email/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    res.json({ available: !user });
  } catch (error) {
    console.error("Error checking email availability:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/total-users", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ totalUsers: count });
  } catch (error) {
    console.error("Error fetching total users count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//-------------------------------------------------------
// Blog Post Management
//-------------------------------------------------------

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { token } = req.cookies;
  try {
    const decoded = jwt.verify(token, secret);
    const { title, summary, content } = req.body;

    let coverUrl;
    if (req.file) {
      const { path } = req.file;
      const result = await cloudinary.uploader.upload(path, {
        folder: "wordhive-uploads",
      });
      coverUrl = result.secure_url;
      fs.unlinkSync(path);
    }

    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: coverUrl,
      author: decoded.id,
    });

    res.json(postDoc);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/post/:id", uploadMiddleware.single("file"), async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const { title, summary, content } = req.body;

    const postDoc = await Post.findById(req.params.id);
    if (!postDoc) return res.status(404).json({ error: "Post not found" });

    const isAuthor = String(postDoc.author) === String(decoded.id);
    if (!isAuthor) return res.status(403).json({ error: "You are not the author" });

    if (req.file) {
      const { path } = req.file;
      const result = await cloudinary.uploader.upload(path, {
        folder: "wordhive-uploads",
      });
      postDoc.cover = result.secure_url;
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    }

    if (title !== undefined) postDoc.title = title;
    if (summary !== undefined) postDoc.summary = summary;
    if (content !== undefined) postDoc.content = content;

    await postDoc.save();

    res.json(postDoc);
  } catch (error) {
    console.error("Error updating post:", error);
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/post", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await Post.findById(id).populate("author", ["username"]);
    if (!postDoc) return res.status(404).json({ error: "Post not found" });
    res.json(postDoc);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/post/:id", async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const info = jwt.verify(token, secret);
    const { id } = req.params;

    const postDoc = await Post.findById(id);
    if (!postDoc) {
      return res.status(404).json({ error: "Post not found" });
    }

    const isAuthor = String(postDoc.author) === String(info.id);
    if (!isAuthor) {
      return res.status(403).json({ error: "You are not the author" });
    }

    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});




// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

//-------------------------------------------------------
// Start Server
//-------------------------------------------------------

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;

