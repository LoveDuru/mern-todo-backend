import dotenv from "dotenv";
// dotenv.config({ path: "./.env" });
dotenv.config();

import cors from "cors";
import mongoose from "mongoose";
import express from "express";
import listRouter from "./routes/listRouter.js";
import userRouter from "./routes/userRouter.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // dev
  "http://localhost:4173", // preview (build test)
];

app.use(
  cors({
    origin: allowedOrigins,
    // credentials: true,
  })
);
app.use(express.json());
app.use("/api/images", express.static("upload/images"));

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/list", listRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 4000;

const MONGO_URI = process.env.MONGO_URI;
// console.log("SECRET_KEY: on index file line 18 is:", process.env.SECRET_KEY);

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

mongoose
  .connect(MONGO_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`))
  )
  .catch((error) => console.log(error));
