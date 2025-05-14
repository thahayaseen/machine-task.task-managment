import dotenv from "dotenv";
dotenv.config();

export const env = {
  get PORT() {
    return process.env.PORT || 4000;
  },
  get MONGO_URL() {
    return process.env.MONGO_URL;
  },
  get JWT_ACCESS_SECRET(){
    return process.env.JWT_ACCESS_SECRET
  }
};
