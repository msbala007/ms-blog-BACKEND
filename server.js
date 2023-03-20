import express, { Router } from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./Router/authRouter.js";
import blogRouter from "./Router/blogRouter.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/img", express.static("img"));
app.use("/profile", express.static("profile"));

app.use("/", router);
app.use("/v1/blog/", blogRouter);

const connection_url = process.env.DB;

mongoose
  .connect(connection_url, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
  })
  .catch((err) => {
    console.error("errror🍔", err);
  })
  .then(() => {
    console.log("mongoose connected");
  });

app.all("*", (req, res) => {
  res.status(404).json({
    message: "this route is not specified",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`hello welcome ${PORT}`));
