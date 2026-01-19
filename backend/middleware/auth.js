import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Unauthorized");
      error.status = 401;
      return next(error);
    }

    const refreshToken = authHeader.split(" ")[1];

    if (!refreshToken) {
      const error = new Error("Access Denied");
      error.status = 401;
      return next(error);
    }

    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
}
const authorizePermissions = (...requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.user._id }).select(
        "+permissions",
      );
      if (!user) {
        const error = new Error("Authorization Error : User Not Found");
        error.status = 404;
        return next(error);
      }

      if (
        !requiredPermission.every((permission) => {
          return user.permissions.includes(permission);
        })
      ) {
        const error = new Error("Authorization Error : Forbidden");
        error.status = 403;
        return next(error);
      }
      next();
    } catch (err) {
      const error = new Error(`Authorization Error : ${err}`);
      next(error);
    }
  };
};

export { authenticate, authorizePermissions };
