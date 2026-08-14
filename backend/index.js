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
const Subscriber = require("./models/Subscriber");

const app = express();
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET || "fallback_jwt_secret";
const uploadMiddleware = multer({ dest: "/tmp" });

const cookieOptions = {
  sameSite: "none",
  secure: true,
  httpOnly: true,
};

const getToken = (req) => {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

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
      cachedDbConnection = mongoose.connect(process.env.MONGO_URI);
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
      res.cookie("token", token, cookieOptions).json({
        id: userDoc._id,
        username: userDoc.username,
        name: userDoc.name || "",
        bio: userDoc.bio || "Passionate writer & reader on WordHive.",
        avatar: userDoc.avatar || "lion",
        token,
      });
    });
  } else {
    res.status(400).json("Wrong username or password");
  }
});

app.get("/profile", async (req, res) => {
  const token = getToken(req);
  if (!token) {
    return res.status(200).json(null);
  }
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    try {
      const userDoc = await User.findById(info.id).select("-password");
      if (!userDoc) {
        return res.json(info);
      }
      res.json({
        id: userDoc._id,
        username: userDoc.username,
        name: userDoc.name || "",
        bio: userDoc.bio || "Passionate writer & reader on WordHive.",
        avatar: userDoc.avatar || "lion",
        email: userDoc.email,
      });
    } catch (e) {
      res.json(info);
    }
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", cookieOptions).json("ok");
});

//-------------------------------------------------------
// Check Username and Email Availability
//-------------------------------------------------------

app.get("/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: new RegExp(`^${username}$`, "i") });
    res.json({ available: !user });
  } catch (error) {
    console.error("Error checking username availability:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/check-email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });
    res.json({ available: !user });
  } catch (error) {
    console.error("Error checking email availability:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//-------------------------------------------------------
// Platform Metrics Endpoint
//-------------------------------------------------------

app.get("/stats", async (req, res) => {
  try {
    const activeWriters = await User.countDocuments();
    const publishedArticles = await Post.countDocuments();
    res.json({ activeWriters, publishedArticles });
  } catch (error) {
    console.error("Error fetching platform metrics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/total-users", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching total users count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//-------------------------------------------------------
// User Profile Endpoint
//-------------------------------------------------------

app.get("/user/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const escapedUsername = username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const userDoc = await User.findOne({
      username: new RegExp(`^${escapedUsername}$`, "i")
    }).select("-password");

    if (userDoc) {
      const posts = await Post.find({ author: userDoc._id })
        .populate("author", ["username", "avatar"])
        .sort({ createdAt: -1 });

      return res.json({
        user: {
          _id: userDoc._id,
          username: userDoc.username,
          name: userDoc.name || "",
          email: userDoc.email,
          bio: userDoc.bio || "Passionate writer & reader on WordHive.",
          avatar: userDoc.avatar || "lion",
          createdAt: userDoc.createdAt || (userDoc._id && userDoc._id.getTimestamp ? userDoc._id.getTimestamp() : new Date()),
        },
        posts,
      });
    }

    // Fallback: If user doc isn't found directly, find posts matching author's populated username
    const posts = await Post.find()
      .populate("author", ["username", "avatar"])
      .sort({ createdAt: -1 });

    const userPosts = posts.filter(
      (p) => p.author && p.author.username && p.author.username.toLowerCase() === username.toLowerCase()
    );

    if (userPosts.length > 0) {
      const actualAuthor = userPosts[0].author;
      return res.json({
        user: {
          _id: actualAuthor._id,
          username: actualAuthor.username,
          name: "",
          bio: "Passionate writer & reader on WordHive.",
          avatar: actualAuthor.avatar || "lion",
          createdAt: new Date(),
        },
        posts: userPosts,
      });
    }

    return res.status(404).json({ error: "User not found" });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/profile", async (req, res) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const { username, name, bio, avatar } = req.body;

    const userDoc = await User.findById(decoded.id);
    if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
    }

    if (username && username.trim() !== userDoc.username) {
      const trimmedUsername = username.trim();
      const existingUser = await User.findOne({ username: trimmedUsername });
      if (existingUser && String(existingUser._id) !== String(userDoc._id)) {
        return res.status(400).json({ error: "Username is already taken" });
      }
      userDoc.username = trimmedUsername;
    }

    if (name !== undefined) userDoc.name = name.trim();
    if (bio !== undefined) userDoc.bio = bio.trim();
    if (avatar !== undefined) userDoc.avatar = avatar;

    await userDoc.save();

    res.json({
      id: userDoc._id,
      username: userDoc.username,
      name: userDoc.name,
      bio: userDoc.bio,
      avatar: userDoc.avatar,
      email: userDoc.email,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

//-------------------------------------------------------
// Blog Post Management
//-------------------------------------------------------

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const { title, summary, content } = req.body;

    let coverUrl;
    if (req.file) {
      const { path } = req.file;
      try {
        const result = await cloudinary.uploader.upload(path, {
          folder: "wordhive-uploads",
        });
        coverUrl = result.secure_url;
      } finally {
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      }
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
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

app.put("/post/:id", uploadMiddleware.single("file"), async (req, res) => {
  const token = getToken(req);
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
  const token = getToken(req);
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

//-------------------------------------------------------
// Newsletter Subscription Endpoint
//-------------------------------------------------------

app.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address" });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const existing = await Subscriber.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(200).json({ message: "You are already subscribed to the Hive newsletter! 🐝" });
    }

    const subscriberDoc = await Subscriber.create({ email: cleanEmail });

    // Dispatch Welcome Newsletter Email via Nodemailer
    try {
      const emailPass = process.env.NODEMAILER_PASS || process.env.EMAIL_PASS;
      const emailUser = process.env.EMAIL_USER || "wordhiveblogs@gmail.com";

      if (emailPass) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });

        await transporter.sendMail({
          from: `"WordHive Newsletter" <${emailUser}>`,
          to: cleanEmail,
          subject: "Welcome to WordHive Newsletter 🐝",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #fef3c7; background-color: #fff8f0; border-radius: 16px;">
              <h2 style="color: #d97706; margin-top: 0;">Welcome to WordHive! 🐝</h2>
              <p style="color: #334155; font-size: 15px; line-height: 1.6;">
                Thank you for subscribing to our newsletter! You will now receive curated digests of top articles and creator insights directly in your inbox.
              </p>
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #fed7aa; color: #94a3b8; font-size: 12px; text-align: center;">
                WordHive Inc. • Empowering writers worldwide
              </div>
            </div>
          `,
        });
      }
    } catch (mailErr) {
      console.error("Nodemailer newsletter dispatch log:", mailErr.message);
    }

    res.json({ message: "Welcome to the Hive newsletter! 🐝", subscriber: subscriberDoc });
  } catch (error) {
    console.error("Error subscribing email:", error);
    res.status(500).json({ error: "Failed to subscribe. Please try again later." });
  }
});

app.get("/subscribe/status", async (req, res) => {
  const token = getToken(req);
  const emailParam = req.query.email;

  let targetEmail = emailParam;
  if (token) {
    try {
      const decoded = jwt.verify(token, secret);
      const userDoc = await User.findById(decoded.id);
      if (userDoc && userDoc.email) {
        targetEmail = userDoc.email;
      }
    } catch (e) {
      // Ignore token decode errors
    }
  }

  if (!targetEmail) {
    return res.json({ isSubscribed: false });
  }

  try {
    const existing = await Subscriber.findOne({ email: targetEmail.trim().toLowerCase() });
    res.json({ isSubscribed: !!existing, email: targetEmail });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/unsubscribe", async (req, res) => {
  const token = getToken(req);
  let targetEmail = req.body.email;

  if (token) {
    try {
      const decoded = jwt.verify(token, secret);
      const userDoc = await User.findById(decoded.id);
      if (userDoc && userDoc.email) {
        targetEmail = userDoc.email;
      }
    } catch (e) {}
  }

  if (!targetEmail || !/\S+@\S+\.\S+/.test(targetEmail)) {
    return res.status(400).json({ error: "Please provide a valid email address" });
  }

  try {
    await Subscriber.findOneAndDelete({ email: targetEmail.trim().toLowerCase() });
    res.json({ message: "You have successfully unsubscribed from the Hive newsletter." });
  } catch (error) {
    console.error("Error unsubscribing email:", error);
    res.status(500).json({ error: "Failed to unsubscribe. Please try again later." });
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

