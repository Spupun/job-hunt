import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies?.token; // Ensure cookies exist
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    // `jwt.verify` is synchronous, no need for `await`
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.id = decode.userId;

    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
      success: false,
    });
  }
};

export default isAuthenticated;
