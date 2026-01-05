import express from "express";
import User from "../schemas/user.js";
import {
  hashPassword,
  validatePassword,
  createToken,
} from "../utils/validation.js";
import protect from "../middleware/auth.js";
import { readFile, writeFile } from "../utils/fileServices.js";
import { fileURLToPath } from "url";
import path from "path";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "../data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const TOKENS_FILE = path.join(DATA_DIR, "tokens.json");

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

    //Email already exists?
    const allUsers = await readFile(USERS_FILE);
    const existingUser = allUsers.find((user) => user.email === email);
    if (existingUser) {
      const error = new Error("Conflict: Email already exists");
      error.status = 409;
      return next(error);
    }

    // Password too short
    if (password.length < 6) {
      const error = new Error("Password must be at least 6 characters");
      error.status = 400;
      return next(error);
    }

    // Get Id
    let newId = 1;
    if (allUsers.length > 0) {
      newId = allUsers[allUsers.length - 1].id + 1;
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User(newId, fullName, email, hashedPassword, role);

    const { accessToken, refreshToken } = await createToken(newUser);
    allUsers.push(newUser);
    await writeFile(USERS_FILE, allUsers);

    // Response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        userId: newUser.id,
        email: newUser.email,
        fullName: newUser.fullname,
        role: newUser.role,
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
    const allUsers = await readFile(USERS_FILE);

    //Validation
    if (!email) {
      const error = new Error("Email is required");
      error.status = 400;
      return next(error);
    }

    const existingUser = allUsers.find((u) => u.email === email);

    if (
      !existingUser ||
      !(await validatePassword(password, existingUser.password))
    ) {
      const error = new Error("Login error: Invalid Credentials");
      error.status = 401;
      return next(error);
    }

    const { accessToken, refreshToken } = await createToken(existingUser);

    return res.status(201).json({
      success: true,
      message: "Login successful",
      data: {
        userId: existingUser.id,
        fullName: existingUser.fullname,
        role: existingUser.role,
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
    let allTokens = await readFile(TOKENS_FILE);
    const payload = req.user;

    allTokens = allTokens.filter((token) => token.userId !== payload.userId);
    await writeFile(TOKENS_FILE, allTokens);
  } catch (err) {
    next(err);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const allUsers = await readFile(USERS_FILE);
    const allTokens = await readFile(TOKENS_FILE);
    const oldRefreshToken = req.body.refreshToken;

    //Validations
    //Token

    const payload = jwt.verify(oldRefreshToken, process.env.SECRET_KEY);
    const existingToken = allTokens.find(
      (token) => token.userId === payload.userId
    );

    // Check if oldrefreshtoken and token in database match
    if (oldRefreshToken !== existingToken.token) {
      const error = new Error("Invalid Token");
      error.status = 401;
      return next(error);
    }

    //Check if oldrefreshtoken is linked to any user
    const existingUser = allUsers.find((u) => u.id === payload.userId);
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
