require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dbURL = process.env.MONGO_URL;

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

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  res.status(201).json({
    email: email,
    password: password,
    message: "User is created.",
  });
});

app.post("/login", (req, res) => {
  res.status(200).json({ message: "User is logged in." });
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
