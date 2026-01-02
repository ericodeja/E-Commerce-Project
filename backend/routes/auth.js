import express from "express";
import User from "../schemas/user.js";
import {
  hashPassword,
  validatePassword,
  createToken,
} from "../utils/validation.js";
import { readFile, writeFile } from "../utils/fileServices.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "../data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

const router = express.Router();

//Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//Routes
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    //Validation
     if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required'
      });}

    //Email already exists?
    const allUsers = await readFile(USERS_FILE);
    const existingUser = allUsers.find(user => user.email === email)
    if (existingUser) {
    res.status(409).json({ success: false, message: "Conflict: Email already exists" });


    // Password too short
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }
  }

 
  // Get Id
  let newId = 1;
  if (allUsers.length > 0) {
    newId = allUsers[allUsers.length - 1].id + 1;
  }

  const hashedPassword = await hashPassword(password);
  const newUser = new User(newId, fullName, email, hashedPassword, role);

  const { accessToken } = await createToken(newUser);
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
      token: accessToken,
    },
  });
} catch (error){
  console.error('Signup error:', error);
    return res.status(500).json({  // ← Send server error here
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

export default router;
