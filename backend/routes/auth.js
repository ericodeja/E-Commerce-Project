import express from "express";
import {
  hashPassword,
  validatePassword,
  createToken,
} from "../utils/validation.js";
import protect from "../middleware/auth.js";
import { readFile, writeFile } from "../utils/fileServices.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Token from "../models/token.model.js";

const router = express.Router();

//Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//Routes
router.post("/signup", async (req, res, next) => {
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

    const passwordHash = await hashPassword(password);
    const user = new User({
      fullName,
      email,
      passwordHash,
      role: role,
      status: "active",
      isEmailVerified: false,
      failedLoginAttempts: 0,
      preferences: {
        receiveEmails: false,
        receiveSMS: true,
        language: "en",
        currency: "NGN",
      },
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
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Validation
    if (!email) {
      const error = new Error("Email is required");
      error.status = 400;
      return next(error);
    }

    const user = await User.findOne({ email: email });

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
});

router.post("/logout", protect, async (req, res, next) => {
  try {
    const payload = req.user;
    await Token.deleteOne({ userId: payload._id });
    res.status(200).json('Delete Successful');
  } catch (err) {
    next(err);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const oldRefreshToken = req.body.refreshToken;

    //Validations
    //Token
    const payload = jwt.verify(oldRefreshToken, process.env.SECRET_KEY);
    const existingToken = await Token.findOne({userId: payload._id})

    // Check if oldrefreshtoken and token in database match
    if (oldRefreshToken !== existingToken.token) {
      const error = new Error("Invalid Token");
      error.status = 401;
      return next(error);
    }

    //Check if oldrefreshtoken is linked to any user
    const existingUser = await User.findOne({_id: payload._id})
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
});

export default router;
