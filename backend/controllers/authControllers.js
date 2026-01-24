import {
  hashPassword,
  validatePassword,
  createToken,
  createResetToken,
} from "../utils/validation.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Token from "../models/token.model.js";
import passwordResetEmail from "../utils/email.js";
import crypto from "crypto";
import { roles, rolePermissionsMap } from "../utils/rolePermissions.js";

const signup = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    //Validation
    if (!email) {
      const error = new Error("Email is required");
      error.status = 400;
      return next(error);
    }

    // Password too short
    if (password.length < 6) {
      const error = new Error("Password must be at least 6 characters");
      error.status = 400;
      return next(error);
    }

    if (!roles.includes(role)) {
      const error = new Error("Invalid Role");
      error.status = 400;
      return next(error);
    }

    const passwordHash = await hashPassword(password);

    const user = new User({
      fullName,
      email,
      passwordHash,
      role,
      // failedLoginAttempts: 0,
    });

    await user.save();

    const { accessToken, refreshToken } = await createToken(user);

    // Response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        _id: user._id,
        fullName: user.fullName,
        role: user.role,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    const error = new Error(`Signup error: ${err}`);
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Validation
    if (!email) {
      const error = new Error("Email is required");
      error.status = 400;
      return next(error);
    }

    const user = await User.findOne({ email: email }).select("+passwordHash");

    if (!user || !(await validatePassword(password, user.passwordHash))) {
      const error = new Error("Login error: Invalid Credentials");
      error.status = 401;
      return next(error);
    }

    const { accessToken, refreshToken } = await createToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        fullName: user.fullName,
        role: user.role,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    const error = new Error(`Login error: ${err}`);
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const payload = req.user;
    await Token.findOneAndUpdate(
      { userId: payload._id },
      { refreshToken: undefined },
    );
    res.status(200).json("Delete Successful");
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const oldRefreshToken = req.body.refreshToken;

    //Validations
    //Token
    const payload = jwt.verify(oldRefreshToken, process.env.SECRET_KEY);
    const existingToken = await Token.findOne({ userId: payload._id }).select(
      "+refreshToken",
    );

    // Check if oldrefreshtoken and token in database match
    if (oldRefreshToken !== existingToken.refreshToken) {
      const error = new Error("Invalid Token");
      error.status = 401;
      return next(error);
    }

    //Check if oldrefreshtoken is linked to any user
    const existingUser = await User.findOne({ _id: payload._id });
    if (!existingUser) {
      const error = new Error("Invalid Token");
      error.status = 401;
      return next(error);
    }

    //Get new Tokens
    const { accessToken, refreshToken } = await createToken(existingUser);

    return res.status(201).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const resetToken = await createResetToken(user);
    await passwordResetEmail(resetToken);
    res.status(200).json("Email sent");
  } catch (err) {
    const error = new Error(`Reset error: ${err}`);
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const incomingHashedToken = crypto
      .createHash("sha256")
      .update(req.body.resetToken)
      .digest("hex");

    const user = await User.findOne({ email: req.body.email }).select(
      "+passwordHash",
    );
    const matchingToken = await Token.findOne({ userId: user._id }).select(
      "+passwordResetToken +passwordResetExpires",
    );

    if (incomingHashedToken !== matchingToken.passwordResetToken) {
      const error = new Error("Invalid or expired token");
      return next(error);
    }

    if (matchingToken.passwordResetExpires < Date.now()) {
      const error = new Error("Invalid or expired token");
      return next(error);
    }

    const newPasswordHash = await hashPassword(req.body.newPassword);
    await user.updateOne({ passwordHash: newPasswordHash });
    await user.save();

    await matchingToken.updateOne({ passwordResetToken: "" });
    await matchingToken.updateOne({ passwordResetExpires: 0 });
    await matchingToken.save();

    res.status(200).json({
      success: true,
      message: "Successful",
    });
  } catch (err) {
    const error = new Error(`Reset Error: ${err}`);
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }
    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (err) {
    const error = new Error(`Error: ${err}`);
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const filter = { _id: req.user._id };
    const update = req.body;

    const result = await User.findOneAndUpdate(filter, update, { new: true });
    return res.status(200).json({
      success: true,
      data: { result },
    });
  } catch (err) {
    const error = new Error(`Update Error: ${err}`);
    next(error);
  }
};

export default {
  signup,
  login,
  logout,
  refresh,
  getUser,
  updateUser,
  forgotPassword,
  resetPassword,
};
