const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    pday: {
      type: Number,
    },
    dailynumber: {
      type: Number,
    },
  },
  { timestamps: true }
);

UserSchema.method("generateAuthToken", async function () {
  const user = this;
  const token = jwt.sign({ id: user._id, emailId: user.emailId }, "qwertyabdc");
  return token;
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
