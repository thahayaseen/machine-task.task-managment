import { Restaurant } from "./../models/implementation/resturence.model";
import { HttpResponse, HttpStatus } from "@/constants";
import { IRestaurantServices } from "@/services/interface/Iresturent.services";
import { createHttpError } from "@/utils/httpError.utill";
import { UserRequest } from "@/utils/httpInterface.utill";
import formatZodErrors from "@/utils/zod.util";
import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
const addressSchema = z.object({
  address_line: z.string().min(1, "Address line is required"),
  pincode: z.number().int().positive("Pincode must be a positive number"),
});

export class RestaurantController {
  constructor(private resturentService: IRestaurantServices) {}
  async addRestaurent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      console.log(data);

      const { id } = (req as UserRequest).user;
      const filename = req.files;
      if (!filename) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          HttpResponse.INVALID_CREDENTIALS
        );
      }
      if (Array.isArray(req.files)) {
        data.image = req.files.map((file) => file.filename);
      }
      data.address = JSON.parse(data.address);
      addressSchema.parse(data.address);
      console.log("asdf", data, "newondddd");

      await this.resturentService.createResturant(data, id);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Restaurant created success",
      });
      return;
    } catch (error) {
      if (error instanceof ZodError) {
        console.error(error);
        res.status(HttpStatus.BAD_REQUEST).json({
          error: HttpResponse.INVALID_CREDENTIALS,
          details: formatZodErrors(error),
        });
        return;
      }
      next(error);
    }
  }
  async getRestaurent(req: Request, res: Response, next: NextFunction) {
    try {
      const { N, E } = req.query;
      if (!N || !E) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          HttpResponse.INVALID_CREDENTIALS
        );
      }
      const dat = await this.resturentService.getByDistence([
        String(N),
        String(E),
      ]);
      console.log(dat);
      res.status(HttpStatus.OK).json({
        success: true,
        data: dat,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateRestaurent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const { resturentid } = req.params;
      const resturent = await this.resturentService.updateResturentData(
        (req as UserRequest).user.id,
        resturentid,
        data
      );
      res.status(HttpStatus.OK).json({
        success: true,
        data: resturent,
      });
    } catch (error) {
      next(error);
    }
  }
}
