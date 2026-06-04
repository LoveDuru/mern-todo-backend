import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

import User from "../model/userSchema.js";

export const signUp = async (req, res) => {
  const { email, password, confirmPassword, name } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user already exists!" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "passwords don't match" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      image: req.file ? `api/images/${req.file.filename}` : null,
      authProvider: "local",
    });
    await newUser.save();
    const { password: userPassword, ...userData } = newUser._doc;
    res.status(201).json(userData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ message: "user does not exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExists.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "password don't match" });
    }

    const token = jwt.sign({ id: userExists._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    const { password: userpassword, ...userData } = userExists._doc;
    res.status(200).json({ token: token, user: userData });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;
    let user = await User.findOne({ email });
    if (user && user.authProvider === "local") {
      return res.status(400).json({
        message: "use email/password login",
      });
    }

    if (!user) {
      user = await User.create({
        email,
        name,
        image: picture || "",
        googleId: sub,
        authProvider: "google",
      });
    }

    const appToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    res.status(200).json({ token: appToken, user });
  } catch (error) {
    res.status(401).json({ message: "Google auth failed" });
  }
};
