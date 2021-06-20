import express from "express";

import {
  signin,
  signup,
  resetpassword,
  forgetPassword,
  getResetPassword,
  postResetPassword,
} from "../controllers/user.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.patch("/resetpassword", resetpassword);
router.post("/forgetPassword", forgetPassword);
router.get("/resetPassword/:id/:token", getResetPassword);
router.post("/resetPassword/:id/:token", postResetPassword);

export default router;
