import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  name: { type: String, required: true },
  thumbnail: { type: String, required: true },
  price: { type: Number, required: true },

  quantity: { type: Number, min: 1, default: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      unique: true,
    },

    items: { type: [cartItemSchema], default: [] },

    subTotal: Number,
    tax: Number,
    shipping: Number,
    discount: Number,
    total: Number,
    currency: { type: String, default: "NG" },

    coupon: {
      code: String,
      discountAmount: Number,
      type: { type: String, enum: ["percentage", "fixed"] },
    },

    // status: {
    //   type: String,
    //   enum: ["active", "abandoned", "converted", "expired"],
    //   default: "active",
    // },

    expiresAt: Date,
  },
  { timestamps: true },
);

cartSchema.pre("save", function () {
  if (!Array.isArray(this.items)) {
    this.items = [];
  }
  this.subTotal = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  this.tax = this.subTotal * 0.075;
  this.total = this.subTotal + this.tax - this.subTotal * (this.discount || 0);
});

cartSchema.pre("updateOne", function () {
  const update = this.getUpdate();

  if (update.items && Array.isArray(update.items)) {
    const subTotal = update.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    update.subTotal = subTotal;
    update.tax = subTotal * 0.075;
    update.total = subTotal + update.tax - subTotal * (update.discount || 0);
  }
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
