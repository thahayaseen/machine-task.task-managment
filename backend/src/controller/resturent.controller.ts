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
      if (data._id) {
        delete data._id;
      }
      if (data.__v) {
        delete data.__v;
      }

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
      console.log(data, "dataus", { ...req.body });

      if (data._id) {
        delete data._id;
      }
      if (data.__v) {
        delete data.__v;
      }
      data.address = JSON.parse(data.address);
      addressSchema.parse(data.address);
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
  async getMyResturents(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) | 1;
      const limit = Number(req.query.limit) | 5;
      const data = await this.resturentService.getByuserid(
        (req as UserRequest).user.id,
        page,
        limit
      );
      res.status(HttpStatus.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await this.resturentService.getRestaurentById(id);
      res.status(HttpStatus.OK).json({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteRestaurent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "Id Not found");
      }
      if (!(req as UserRequest).user.id) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "User not fournd");
      }
      console.log(id);
      console.log((req as UserRequest).user.id);
      
      await this.resturentService.deleteResturent(
        id,
        (req as UserRequest).user.id
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: "delted success",
      });
    } catch (error) {
      next(error);
    }
  }
}
