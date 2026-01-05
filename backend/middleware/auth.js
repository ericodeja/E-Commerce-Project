import jwt from "jsonwebtoken";

function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Unauthorized");
      error.status = 401;
      return next(error);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      const error = new Error("Access Denied");
      error.status = 401;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
}

export default protect;
