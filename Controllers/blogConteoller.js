import BLOG from "../Model/blogSchema.js";
import TEST from "../Model/testing.js";
import USER from "../Model/authSchema.js";
import multer from "multer";
import mongoose from "mongoose";

const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "img");
  },
  filename: (req, file, callback) => {
    console.log(file);
    console.log(req.file);
    const extFilename = file.mimetype.split("/")[1];
    callback(null, `Blog-post-image-${Date.now()}.${extFilename}`);
  },
});

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback("error", false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
const uploadImage = upload.single("image");

//unwanted

const getPost = async (req, res, next) => {
  // const { name, profilepic, email, password } = req.body;
  try {
    const blog = await BLOG.find()
      .sort({ _id: -1 })
      .populate({
        path: "user",
        select: ["name", "photo"],
      });

    res.status(200).json({
      totalBlogs: blog.length,
      result: "success",
      blog,
    });
  } catch (error) {
    console.log(error);
  }
};

const createpost = async (req, res, next) => {
  const { name, image, description, user } = req.body;

  let existingUser;
  try {
    existingUser = await USER.findById(user);
  } catch (error) {
    console.log(error);
  }
  if (!existingUser) {
    return res.status(500).json({
      message: "sorry",
    });
  }

  let blog;
  try {
    // const userName = await USER.findOne({ name });
    blog = await BLOG.create({
      name,
      image: req.file.filename,
      description,
      user,
    });
    res.status(201).json({
      result: "success",
      blog,
    });
    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    blog = await blog.save({ session });
    await session.commitTransaction();
  } catch (error) {
    console.log(error);
  }
};
const getBlogById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let blog;
    blog = await BLOG.findById(id).populate({
      path: "user",
      select: ["name", "photo"],
    });
    return res.status(200).json({
      result: "success",
      blog,
    });
    if (!blog) {
      return res.status(404).json({
        message: "post not to br found",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const updatePost = async (req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  try {
    const update = req.params.id;
    const blog = await BLOG.findByIdAndUpdate(update, {
      name: req.body.name,

      description: req.body.description,
      new: true,
    });
    res.status(201).json({
      result: "success",
      blog,
    });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const deletePost = async (req, res, next) => {
  try {
    const deleteId = req.params.id;
    await BLOG.findByIdAndDelete(deleteId);
    res.status(200).json({
      result: "success",
      message: "successfully deleted",
    });
  } catch (error) {
    res.status(204).json({
      message: error,
    });
  }
};

const getBlogUserById = async (req, res, next) => {
  let userblogs;
  const userid = req.params.id;
  try {
    userblogs = await USER.findById(userid).sort({ _id: -1 }).populate("blogs");

    res.status(200).json({
      blogs: userblogs,
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  getPost,
  createpost,
  updatePost,
  deletePost,
  uploadImage,
  getBlogById,
  getBlogUserById,
};
