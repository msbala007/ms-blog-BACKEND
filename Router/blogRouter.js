import express from "express";
import {
  getPost,
  createpost,
  updatePost,
  deletePost,
  uploadImage,
  getBlogById,
  getBlogUserById,
} from "../Controllers/blogConteoller.js";

const blogtrouter = express.Router();

blogtrouter.route("/").get(getPost);
blogtrouter.route("/:id").get(getBlogById);
blogtrouter.route("/post").post(uploadImage, createpost);
blogtrouter.route("/post/update/:id").put(updatePost);
blogtrouter.route("/post/delete/:id").delete(deletePost);

blogtrouter.route("/user/:id").get(getBlogUserById);

export default blogtrouter;
