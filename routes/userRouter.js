import express from "express";
import { signIn, signUp, googleAuth } from "../controller/userContr.js";
import upload from "../middleware/upload.js";

const router = express.Router();
router.post("/", upload.single("image"), signUp);
router.post("/signin", signIn);
router.post("/google", googleAuth);

export default router;
