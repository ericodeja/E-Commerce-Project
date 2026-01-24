import mongoose from "mongoose";
import { Schema } from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      fullDescription: {
        type: String,
      },
      shortDescription: {
        type: String,
      },
    },

    pricing: {
      price: {
        type: Number,
        required: true,
      },
      salePrice: Number,
      currency: {
        type: String,
        default: "NGN",
      },
      costPrice: {
        type: Number,
        select: false,
      },
    },

    stock: {
      quantity: {
        type: Number,
        required: true,
      },
      isInStock: Boolean,
      lowStockThreshold: Number,
    },
    media: {
      images: {
        type: [String],
      },
      thumbnail: {
        type: String,
        required: true,
      },
    },

    category: {
      category: Schema.Types.ObjectId,
      subCategories: [Schema.Types.ObjectId],
      tags: [String],
    },
    rating: Number,
    reviewCount: Number,
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
