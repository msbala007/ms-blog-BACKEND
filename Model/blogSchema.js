import mongoose from "mongoose";
// import USER from "../Model/authSchema.js";
const { ObjectId } = mongoose.Schema;

const blogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    // senderId: { type: mongoose.Types.ObjectId, ref: "USER", required: true },
    image: {
      type: String,
      default: "default.jpg",
      // required: [true, "photo is required"],
    },
    description: {
      type: String,
      required: [true, "please write something"],
    },

    user: [
      {
        type: mongoose.Types.ObjectId,
        ref: "USER",
        required: true,
      },
    ],
  },

  { timestamps: true }
);

export default mongoose.model("BLOG", blogSchema);
