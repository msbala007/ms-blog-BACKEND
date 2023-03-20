import USER from "../Model/authSchema.js";
import bcrypt from "bcrypt";
import multer from "multer";

const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "profile");
  },
  filename: (req, file, callback) => {
    console.log(file);
    // console.log(req.file.filename);
    const extFilename = file.mimetype.split("/")[1];
    callback(null, `Blog-user-profile-photo-${Date.now()}.${extFilename}`);
  },
});
const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback("error", false);
  }
};
//
// const storage = multer.memoryStorage();
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
const uploadProfileImage = upload.single("photo");

const getAllUsers = async (req, res) => {
  try {
    const users = await USER.find();

    res.status(200).json({
      result: "success",
      users,
    });
  } catch (error) {
    console.log(error);
  }
};

const signup = async (req, res, next) => {
  const { name, photo, email, password } = req.body;
  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.trim() < 8
  ) {
    return res.status(404).json({ message: "Invalid data!!!" });
  }

  //Email

  let existingEmail;
  try {
    existingEmail = await USER.findOne({ email });
  } catch (error) {
    console.log(error);
  }
  if (existingEmail) {
    return res.status(404).json({ emailError: "This email already existed" });
  }

  // if (password.length < 8) {
    // return res
      // .status(404)
      // .json({ passwordError: "password length should be min 8 characters " });
  // }

  let user;
  try {
    user = await USER.create({
      name,
      email,
      password,
    });
    await user.save();
    res.status(201).json({
      result: "success",
      user,
    });
  } catch (error) {
    return res.status(404).json({ error: "please provide the valid data!!! " });
    console.log(error);
  }
  // if (!user) {
  // return res.status(500).json({ message: "unexpected error" });
  // }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password.trim() < 8) {
    return res.status(422).json({ error: "please provide correct email " });
  }
  let existingUser;
  try {
    existingUser = await USER.findOne({ email });
  } catch (error) {
    console.log(error);
  }

  if (!existingUser) {
    return res
      .status(404)
      .json({ error: "please provide correct email & password!!! " });
  }

  const correctPassword = bcrypt.compareSync(password, existingUser.password);

  if (!correctPassword) {
    return res.status(400).json({
      message: "password incorrect",
    });
  }

  res.status(200).json({
    message: "login successful",
    user: existingUser,
  });
};

const userProfileUpdate = async (req, res, next) => {
  const update = req.params.id;

  try {
    // const filterBody=filderObj(req.body,'name','city')

    if (req.file) {
      const user = await USER.findByIdAndUpdate(update, {
        $set: {
          photo: req.file.filename,
          name: req.body.name,
          nickname: req.body.nickname,
          city: req.body.city,
        },
        new: true,
      });
      res.status(201).json({
        result: "successfully updated",
        user,
      });
    } else {
      const user = await USER.findByIdAndUpdate(update, {
        $set: {
          name: req.body.name,
          nickname: req.body.nickname,
          city: req.body.city,
        },

        new: true,
      });
      res.status(201).json({
        result: "successfully updated",
        user,
      });
    }
  } catch (error) {
    console.log("updated Error", error);
  }
};

const getBlogUserById = async (req, res, next) => {
  let userblogs;
  const userid = req.params.id;
  try {
    userblogs = await USER.findById(userid);
    res.status(200).json({
      userblogs,
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  signup,
  login,
  getAllUsers,
  userProfileUpdate,
  getBlogUserById,
  uploadProfileImage,
};
