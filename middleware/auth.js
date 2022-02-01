const User = require("../models/users");
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  try {
    if (!req.headers.authorization) {
      res.status(401).json({ message: "Please login to continue" });
    }
    const token = await req.headers.authorization.split(" ")[1];
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "Please login to continue" });
    }
    const decoded = await jwt.verify(token, "qwertyabdc");
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid session, Please login again" });
    }
    res.locals = user;
    next();
  } catch (err) {
    console.log(err);
    // res.status(400).json({ message: "Please try again later" });
  }
};
