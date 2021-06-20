import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const auth = async (req, res, next) => {
  try {
    //token is on the first position of array after we split it
    const token = req.headers.authorization.split(" ")[1];

    const isCustomAuth = token.length < 500;
    let decodedData;
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.SECRET_KEY);
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      //sub is basically googles name for specific id
      req.userId = decodedData?.sub;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
