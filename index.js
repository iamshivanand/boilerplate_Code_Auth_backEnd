import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import userRoutes from "./routes/user.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(cors());

//we should always specify routes after cors

app.use("/user", userRoutes);
app.get("/", (req, res) => {
  res.send(
    "/products for all the products and /products/search/:name for search"
  );
});
const PORT = process.env.PORT || 8000;
// const CONNECTION_URL =
//   "mongodb+srv://Shiv:O0U6uGxZBqrSaWpz@personal.pmaoi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(
      PORT,
      console.log(`server is up and database is connected on PORT: ${PORT}`)
    );
  })
  .catch((error) => {
    console.log(error.message);
  });

mongoose.set("useFindAndModify", false);
