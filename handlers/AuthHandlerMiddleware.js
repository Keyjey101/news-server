require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }


  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "User is not authenticated" });
    }
  

    const isAuth = jwt.verify(token, process.env.JWT);

    req.user = isAuth;
    next();
  } catch (e) {
    res.status(401).json({ message: "User is not authenticated" });
  }
};
