require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
const User = require("./models/users");
const PORT = process.env.PORT || 3005;

app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1/daily-contents", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("db connected");
  });

app.post("/signup", async function (req, res) {
  try {
    const { username, emailId, password } = req.body;

    const users = await User.findOne({
      $or: [{ emailId: emailId }],
    });
    if (users)
      res.status(401).json({
        type: "emailId",
        message: "Email id already exists.",
      });
    else {
      let hashedpass = await bcrypt.hash(password, 10);

      const user_ = new User({
        username: username,
        emailId: emailId,
        password: hashedpass,
        pday: 0,
        dailynumber: 0,
      });
      await user_.save();
      const token = await user_.generateAuthToken();
      res
        .status(200)
        .json({ token: token, user_, message: "Sign Up Successfull" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Please try again later" });
  }
});
app.post("/signin", async function (req, res) {
  let newDate = new Date();
  let date = newDate.getDate();
  try {
    const { emailId, password } = req.body;
    const user_ = await User.findOne({ emailId: emailId.trim() });
    if (user_) {
      let valid = await bcrypt.compare(password, user_.password);
      if (valid) {
        const token = await user_.generateAuthToken();
        if (date != user_.pday) {
          user_.dailynumber = Math.floor(
            100000000000 + Math.random() * 900000000000
          ).toString();
          user_.pday = date;
          await user_.save();
        }
        res.status(200).json({ token, user_, message: "User logged in" });
      } else {
        res.status(401).json({ type: "password", message: "Invalid password" });
      }
    } else {
      res
        .status(401)
        .json({ type: "emailId", message: "Email Id does not exists" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Please try again later" });
  }
});

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
