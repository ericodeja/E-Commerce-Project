import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Token from "../models/token.model.js";
import crypto from "crypto";

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
      _id: user._id.toString(),
    },
    process.env.SECRET_KEY,
    { expiresIn: "5m" }
  );
  //Refresh Token
  const refreshToken = jwt.sign(
    {
      _id: user._id.toString(),
    },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );

  const existingUser = await Token.findOne({ userId: user._id });

  if (existingUser) {
    existingUser.refreshToken = refreshToken;
    await existingUser.save();
  } else {
    const token = new Token({
      userId: user._id,
      refreshToken,
      passwordResetToken: "",
    });
    await token.save();
  }

  return { accessToken, refreshToken };
}

async function createResetToken(user) {
  try {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const existingToken = await Token.findOneAndUpdate(
      { userId: user._id },
      { passwordResetToken: hashedToken, passwordResetExpires: Date.now() + 15 * 60 * 1000 },
      { new: true, upsert: true }
    );

    await existingToken.save();
    return rawToken;
  } catch (err) {
    console.error(err);
    return err;
  }
}

export { hashPassword, validatePassword, createToken, createResetToken };
