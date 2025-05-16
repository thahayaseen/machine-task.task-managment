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
    // if (data._id) {
    //   delete data._id;
    // }
    data.location = {
      type: "Point",
      coordinates: data.coordinates,
    };
    console.log(data, "data is before");
    return await this.RestaurantRepository.create(data);
  }
  async getDistence(locaion: string[]): Promise<IRestaurantDocument[]> {
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
          $maxDistance: 5000,
        },
      },
    };
    return await this.RestaurantRepository.find(filer);
  }
  private async varifyUser(
    userid: Types.ObjectId,
    restaurantid: Types.ObjectId
  ) {
    const RestaurantData = await this.RestaurantRepository.findById(
      restaurantid
    );
    if (RestaurantData && RestaurantData.userid) {
      if (RestaurantData.userid !== userid) {
        throw createHttpError(
          HttpStatus.UNAUTHORIZED,
          "Don't Have access in this api"
        );
      }
    }
    return RestaurantData;
  }
  async deleteResturent(id: string, userid: string): Promise<void> {
    await this.varifyUser(new Types.ObjectId(userid), new Types.ObjectId(id));
    if (!id) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.INVALID_CREDENTIALS
      );
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

    const newdata = await this.RestaurantRepository.findByIdAndUpdate(
      new Types.ObjectId(userid),
      data
    );
    return newdata;
  }
}
