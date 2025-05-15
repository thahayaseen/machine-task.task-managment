import { IUser } from "shared/types";
import { IUserRepository } from "../interface/Iuser.repository";
import { IUserModel, userModel } from "@/models/implementation/user.model";
import { BaseRepository } from "../basic.repository";
import { Document, Types } from "mongoose";

export class userRepository
  extends BaseRepository<IUserModel>
  implements IUserRepository
{
  constructor() {
    super(userModel);
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
