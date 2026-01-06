import mongoose from "mongoose";
import { Schema} from "mongoose";

const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model("Token", TokenSchema);
export default Token;
