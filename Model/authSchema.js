import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  nickname: {
    type: String,
  },
  photo: {
    type: String,
    default: "default.jpg",
    // required: [true, "photo is required"],
  },
  email: {
    type: String,
    required: [true, "email is required "],
    unique: true,
    validate: [validator.isEmail, "please provide a valid email!"],
  },
  password: {
    type: String,
    required: [true, "password is required "],
    minLength: 8,
  },
  city: {
    type: String,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  blogs: [{ type: mongoose.Types.ObjectId, ref: "BLOG", required: true }],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
});

export default mongoose.model("USER", userSchema);
