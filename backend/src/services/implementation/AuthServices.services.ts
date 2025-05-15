import { IUser } from "shared/types";
import { IAuthServices } from "../interface/Iauth.services";
import { IUserRepository } from "@/repositories/interface/Iuser.repository";
import { userRepository } from "@/repositories/implementation/user.repository";
import { comparePassword, hashPassword } from "@/utils/bcrypt.utill";
import { createHttpError } from "@/utils/httpError.utill";
import { HttpResponse, HttpStatus } from "@/constants";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt.util";
export interface sighUserreturn {
  accessToken: string;
  refreshToken: string;
}
export class AuthServices implements IAuthServices {
  private userRepository;
  constructor() {
    this.userRepository = new userRepository();
  }
  async createUser(data: IUser): Promise<string> {
    const userAldredy = await this.userRepository.findByUsernameOrEmail(
      data.email
    );
    if (userAldredy) {
      throw createHttpError(HttpStatus.CONFLICT, HttpResponse.USER_EXIST);
    }
    data.password = await hashPassword(data.password);
    const result = await this.userRepository.create(data);
    return result.email;
  }
  async sigInUser(email: string, password: string): Promise<sighUserreturn> {
    const data = await this.userRepository.findByUsernameOrEmail(email);
    if (!data) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }
    const compare = comparePassword(data.password, password);
    if (!compare) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.PASSWORD_INCORRECT
      );
    }
    const accessToken = generateAccessToken({
      email: data.email,
      id: data.id,
    });
    const refreshToken = generateRefreshToken({
      email: data.email,
      id: data.id,
    });
    return { accessToken, refreshToken };
  }
}
