import express from "express";
import {
  signup,
  login,
  getAllUsers,
  getBlogUserById,
  userProfileUpdate,
  uploadProfileImage,
} from "../Controllers/authController.js";

const router = express.Router();

router.route("/users").get(getAllUsers);
router.route("/user/:id").get(getBlogUserById);
router.route("/user/signup").post(signup);
router.route("/user/login").post(login);
router.route("/user/profile/:id").put(uploadProfileImage, userProfileUpdate);


export default router;
