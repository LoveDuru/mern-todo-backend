import jwt from "jsonwebtoken";

export const signInAuth = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      return res.status(401).json({
        message: "authorization token required",
      });
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "token invalid",
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
