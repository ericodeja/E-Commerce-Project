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
      select: false,
    },

    passwordHash: { type: String, required: true, select: false },
    isEmailVerified: Boolean,
    role: { type: String, enum: ["user", "admin"] },
    permissions: { type: [String], select: false },
    scopes: [String],
    status: { type: String, enum: ["active", "suspended", "disabled"] },

    addresses: {
      type: [
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
      select: false,
    },

    cart: [
      {
        productId: { type: Schema.Types.ObjectId },
        quantity: Number,
        priceAtAdd: Number,
      },
    ],

    wishlist: [{ type: Schema.Types.ObjectId }],
    orderIds: [{ type: Schema.Types.ObjectId }],
    paymentMethods: {
      type: [
        {
          provider: String,
          tokenId: String,
          last4: String,
          expiry: String,
        },
      ],
      select: false,
    },

    preferences: {
      receiveEmails: Boolean,
      receiveSMS: Boolean,
      language: String,
      currency: String,
    },

    lastLogin: { type: Date, select: false },
    failedLoginAttempts: { type: Number, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", UserSchema);
export default User;
