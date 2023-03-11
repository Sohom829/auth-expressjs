require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dbURL = process.env.MONGO_URL;
const User = require("./models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("MongoDB Atlas is connected.");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/./views/index.html");
});

app.post("/register", async (req, res) => {
  try {
    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
      const newUser = new User({
        email: req.body.email,
        password: hash,
      });
      await newUser.save();
      res.status(201).json({
        message: "New user created.",
        newUser,
      });
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result === true) {
          res.status(200).json({ message: "User is logged in." });
        }
      });
    } else {
      res.status(400).json({
        message: "User not found.",
        status: 400,
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found.",
    status: 404,
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Internal server error",
  });
});

let PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
