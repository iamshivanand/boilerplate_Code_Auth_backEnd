import { transporter } from "../config/nodemailer.js";
import dotenv from "dotenv";

dotenv.config();

export const forgetPasswordLink = (email, link) => {
  console.log("email : ", email);
  console.log("link", link);
  // console.log("you just pressed forget password", email);
  transporter.sendMail(
    {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "password reset Link!!",
      html: `<h5>Reset Link is : ${link} </h5>`,
    },
    (err, info) => {
      if (err) {
        console.log("error in sending mail", err);
        return;
      }
      console.log("Mail Delivered", info);
      return;
    }
  );
};
