import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assetName: {
      type: String,
      required: true,
    },

    symbol: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["stock", "crypto"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    buyPrice: {
      type: Number,
      required: true,
    },

    currentPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Investment ||
  mongoose.model("Investment", InvestmentSchema);