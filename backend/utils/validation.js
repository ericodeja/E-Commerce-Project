import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readFile, writeFile } from "../utils/fileServices.js";
import Token from "../schemas/token.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "../data");
const TOKENS_FILE = path.join(DATA_DIR, "tokens.json");

async function hashPassword(plainpassword) {
  const hashedPassword = await bcrypt.hash(plainpassword, 10);
  return hashedPassword;
}

async function validatePassword(userInputPassword, storedHashedPassword) {
  const isMatch = await bcrypt.compare(userInputPassword, storedHashedPassword);
  return isMatch;
}


async function createToken(newUser) {
  const accessToken = jwt.sign(
    {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    },
    process.env.SECRET_KEY,
    { expiresIn: "5m" }
  );
  const refreshToken = jwt.sign(
    {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );

  const allTokens = await readFile(TOKENS_FILE);

  let newId = 1;
  if (allTokens.length > 0) {
    newId = allTokens[allTokens.length - 1].id + 1;
  }

  const newToken = new Token(newId, newUser.id, refreshToken);
  allTokens.push(newToken);
  await writeFile(TOKENS_FILE, allTokens);

  return { accessToken };
}

export { hashPassword, validatePassword, createToken };
