import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },

    passwordHash: { type: String, required: true },
    isEmailVerified: Boolean,
    role: { type: String, enum: ["customer", "admin"] },
    scopes: [String],
    status: { type: String, enum: ["active", "suspended", "disabled"] },

    addresses: [
      {
        label: String,
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String,
        isDefault: Boolean,
      },
    ],

    cart: [
      {
        productId: { type: Schema.Types.ObjectId },
        quantity: Number,
        priceAtAdd: Number,
      },
    ],

    wishlist: [{ type: Schema.Types.ObjectId }],
    orderIds: [{ type: Schema.Types.ObjectId }],
    paymentMethods: [
      {
        provider: String,
        tokenId: String,
        last4: String,
        expiry: String,
      },
    ],

    preferences: {
      receiveEmails: Boolean,
      receiveSMS: Boolean,
      language: String,
      currency: String,
    },

    lastLogin: Date,
    failedLoginAttempts: Number,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
