import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "shared/types";

export interface IUserModel extends Document, Omit<IUser, "_id"> {}

const userSchema = new Schema<IUserModel>({
  username: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "user"], // Correctly declare the enum
    default: "user", // Optional default value
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

export default mongoose.model<IUserModel>("User", userSchema);
