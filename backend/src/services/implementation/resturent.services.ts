import path from "path";
import { RestaurantRepository } from "./../../repositories/implementation/resturent.repository";
import { ObjectId, Types } from "mongoose";
// import { Restaurant } from './../../models/implementation/resturence.model';
import { IRestaurantServices } from "../interface/Iresturent.services";
import {
  IRestaurant,
  IRestaurantDocument,
} from "@/models/implementation/resturence.model";
import { createHttpError, HttpError } from "@/utils/httpError.utill";
import { HttpResponse, HttpStatus } from "@/constants";
import { IRestaurantReturn } from "@/types/responceResturents.type";
import { unlink } from "fs";

export class RestaurantServices implements IRestaurantServices {
  private RestaurantRepository;
  constructor() {
    this.RestaurantRepository = new RestaurantRepository();
  }
  async createResturant(
    data: any,
    userid: string
  ): Promise<IRestaurantDocument> {
    data.userid = userid;

    data.location = {
      type: "Point",
      coordinates: data.coordinates,
    };
    const aldredy = await this.RestaurantRepository.findOne({
      name: data.name,
    });
    if (aldredy) {
      throw createHttpError(
        HttpStatus.CONFLICT,
        HttpResponse.RES_ALREADY_EXISTS
      );
    }
    console.log(data, "data is before");
    return await this.RestaurantRepository.create(data);
  }
  async getByDistence(
    locaion: string[],
    page: number,
    limit: number
  ): Promise<IRestaurantReturn> {
    if (locaion.length !== 2) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.INVALID_CREDENTIALS
      );
    }
    const userLocation = {
      type: "Point",
      coordinates: locaion,
    };
    const filer = {
      location: {
        $near: {
          $geometry: userLocation,
          $maxDistance: 25000,
        },
      },
    };
    const pages = await this.RestaurantRepository.getDocumentCount(filer);
    const data = await this.RestaurantRepository.find(filer, page, limit);
    return {
      page: pages,
      data,
    };
  }
  private async varifyUser(
    userid: Types.ObjectId,
    restaurantid: Types.ObjectId
  ) {
    const RestaurantData = await this.RestaurantRepository.findById(
      restaurantid
    );
    if (RestaurantData && RestaurantData.userid) {
      if (String(RestaurantData.userid) !== String(userid)) {
        throw createHttpError(
          HttpStatus.UNAUTHORIZED,
          "Don't Have access in this api"
        );
      }
    }
    return RestaurantData;
  }
  async deleteResturent(id: string, userid: string): Promise<void> {
    const data = await this.varifyUser(
      new Types.ObjectId(userid),
      new Types.ObjectId(id)
    );
    if (!id) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.INVALID_CREDENTIALS
      );
    }
    if (data && data.image) {
      for (let i = 0; i < data.image.length; i++) {
        console.log("fdafdsa", __dirname);

        const filePath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "public",
          "uploads",
          data.image[i]
        );
        unlink(filePath, (err) => {
          if (err) {
            console.log("❌ Error deleting file:", err);
          } else {
            console.log("✅ File deleted successfully");
          }
        });
      }
    }
    await this.RestaurantRepository.deleteOne({ _id: id });

    return;
  }
  async updateResturentData(
    userid: string,
    restaruantid: string,
    data: Partial<IRestaurant>
  ): Promise<IRestaurantDocument | null> {
    await this.varifyUser(
      new Types.ObjectId(userid),
      new Types.ObjectId(restaruantid)
    );
    if (!data) {
      console.log("no data");

      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.INVALID_CREDENTIALS
      );
    }
    if (data._id) {
      delete data._id;
    }
    if (data.userid) {
      delete data.userid;
    }
    if (typeof data.location == "string") {
      data.location = JSON.parse(data.location);
    }
    console.log(data, "after");

    const newdata = await this.RestaurantRepository.update(
      new Types.ObjectId(restaruantid),
      data
    );
    return newdata;
  }
  async getByuserid(
    userid: string,
    page: number,
    limit: number
  ): Promise<IRestaurantReturn> {
    const filter = {
      userid: userid,
    };
    const data = await this.RestaurantRepository.find(filter, page, limit);
    const total = await this.RestaurantRepository.getDocumentCount(filter);
    return { data, total };
  }
  async getRestaurentById(id: string): Promise<IRestaurantDocument | null> {
    return await this.RestaurantRepository.findById(new Types.ObjectId(id));
  }
}
