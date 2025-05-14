import { IUser } from "shared/types";
import { IUserRepository } from "./interface/Iuser.repository";
import userModel, { IUserModel } from "@/models/implementation/user.model";
import { BaseRepository } from "../basic.repository";
import { Document, Types } from "mongoose";

export class userRepository
  extends BaseRepository<IUserModel>
  implements IUserRepository
{
  constructor() {
    super(userModel);
  }
  async userCreate(user: IUser): Promise<IUserModel> {
    return await this.create(user);
  }
  async findUserByEmail(email: string): Promise<IUserModel | null> {
    return await this.findByUsernameOrEmail(email);
  }
  async findUserByUsername(username: string): Promise<IUserModel | null> {
    return await this.findByUsernameOrEmail(username);
  }
  async findByUserId(id: Types.ObjectId): Promise<IUserModel | null> {
    return await this.findById(id);
  }
  async updatePassword(
    userid: string,
    hashedPassword: string
  ): Promise<IUserModel | null> {
    return await this.findOneAndUpdate(
      { _id: userid },
      { password: hashedPassword }
    );
  }
}
