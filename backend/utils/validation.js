import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Token from "../models/token.model.js";

async function hashPassword(plainpassword) {
  const hashedPassword = await bcrypt.hash(plainpassword, 10);
  return hashedPassword;
}

async function validatePassword(userInputPassword, storedHashedPassword) {
  return await bcrypt.compare(userInputPassword, storedHashedPassword);
}

async function createToken(user) {
  //Access Token
  const accessToken = jwt.sign(
    {
      _id: user._id,
      role: user.role,
    },
    process.env.SECRET_KEY,
    { expiresIn: "5m" }
  );
  //Refresh Token
  const refreshToken = jwt.sign(
    {
      _id: user._id,
      role: user.role,
    },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );

  const token = new Token({
    userId: user._id,
    token: refreshToken,
  });

  // Remove User existing refresh Token
  await Token.deleteMany({ userId: user._id });

  await token.save();
  return { accessToken, refreshToken };
}

export { hashPassword, validatePassword, createToken };
