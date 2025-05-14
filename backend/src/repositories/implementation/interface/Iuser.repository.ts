import { IUserModel } from "@/models/implementation/user.model";
import { Types } from "mongoose";
import { IUser } from "shared/types";
export interface IUserRepository {
  userCreate(user: IUser): Promise<IUserModel>;
  findUserByEmail(email: string): Promise<IUserModel | null>;
  findUserByUsername(email: string): Promise<IUserModel | null>;
  findByUserId(id: Types.ObjectId): Promise<IUserModel | null>;
  updatePassword(
    userid: string,
    hashedPassword: string
  ): Promise<IUserModel | null>;
}
