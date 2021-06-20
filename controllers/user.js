import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { forgetPasswordLink } from "../mailers/forgetPassword_mailer.js";

import User from "../models/user.js";
dotenv.config();
export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(200).json({ message: "user doesn't exist" });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(200).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, name } = req.body;
  console.log(req.body);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(200)
        .json({ message: "user already exist please login" });
    if (password !== confirmPassword) {
      return res.status(200).json({ message: "Password don't match" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({ email, password: hashedPassword, name });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const resetpassword = async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword, id } = req.body;
  if (newPassword !== confirmNewPassword) {
    return res.status(200).json({ message: "Password don't match" });
  }
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (isValidId) {
    const user = await User.findById(id);
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(200).json({ message: "Invalid credentials" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      },
      { new: true }
    );

    res.status(200).json({ result: updatedUser });
  }
};
export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  console.log("email", email);
  try {
    //make sure user exist in the database
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(200).json({ message: "user doesn't exist" });

    //user exist create a one time link that is valid for 15 min
    const secret = process.env.SECRET_KEY + existingUser.password;
    const payload = {
      email: existingUser.email,
      id: existingUser._id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "15m" });

    const link = `http://localhost:8000/user/resetPassword/${existingUser._id}/${token}`;
    // console.log(link);

    forgetPasswordLink(email, link);
    res.status(200).json({ message: "check your email for the link" });
  } catch (error) {
    console.log(error);
  }
};
export const getResetPassword = async (req, res) => {
  const { id, token } = req.params;

  try {
    //check if this id exist in database
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      res.status(404).json({ message: "Invalid !!!!!" });
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "Invalid user !!!!!" });
    }
    const secret = process.env.SECRET_KEY + user.password;
    const payload = jwt.verify(token, secret);
    return res.render("reset_password", { email: user.email });
  } catch (error) {
    console.log(error);
  }
};
export const postResetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password, password2 } = req.body;
  if (password !== password2) {
    return res.redirect("back");
  }
  try {
    //check if this id exist in database
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      res.status(404).json({ message: "Invalid !!!!!" });
    }
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "Invalid user !!!!!" });
    }
    const secret = process.env.SECRET_KEY + user.password;
    const payload = jwt.verify(token, secret);
    const hashedPassword = await bcrypt.hash(password, 12);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      },
      { new: true }
    );

    res.status(200).json({ updatedUser });
  } catch (error) {
    console.log(error);
  }
};
