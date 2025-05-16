import { HttpResponse, HttpStatus } from "@/constants";
import { IAuthServices } from "@/services/interface/Iauth.services";
import { createHttpError, HttpError } from "@/utils/httpError.utill";
import { NextFunction, Request, Response } from "express";

export class Authcontroller {
  constructor(private authServices: IAuthServices) {}
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      await this.authServices.createUser(data);
    } catch (error) {
      next(error);
    }
  }
  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      console.log(email, password, "emadn pass is ");

      const data = await this.authServices.sigInUser(email, password);
      res.cookie("refresh", data.refreshToken, {
        httpOnly: true,
        secure: false,
      });
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: HttpResponse.USER_CREATION_SUCCESS,
        accessToken: data.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }
}
