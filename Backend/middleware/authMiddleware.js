const jwt = require("jsonwebtoken");
const User = require("../model/auth/authModel");

exports.protect = async (req, res, next) => {
  // let token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
  let token = req.cookies.token;

  
  console.log(res?.cookies?.token);
  


  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    next(err);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Access denied" });
    next();
  };
};
