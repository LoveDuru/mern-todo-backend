import express from "express";
import {
  list,
  createPost,
  getTodo,
  updateList,
  deletePost,
} from "../controller/listContr.js";
import { signInAuth } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", signInAuth, list);
router.get("/:id", signInAuth, getTodo);
router.post("/createPost", signInAuth, createPost);
router.put("/:id", signInAuth, updateList);
router.delete("/:id", signInAuth, deletePost);

export default router;
