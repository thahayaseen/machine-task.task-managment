import { IUserModel } from "@/models/implementation/user.model";

export interface IUserRepository {
  updatePassword(
    userid: string,
    hashedPassword: string
  ): Promise<IUserModel | null>;
}
