import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "shared/types";

export interface IUserModel extends Document, Omit<IUser, "_id"> {}

const userSchema = new Schema<IUserModel>({
  username: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  email: {
    type: String,
    required: true, // Use 'required' instead of 'require'
    unique: true,
  },
  password: {
    type: String,
  },
});

export const userModel = mongoose.model<IUserModel>("User", userSchema);
