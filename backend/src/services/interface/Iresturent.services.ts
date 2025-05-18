import {
  IRestaurant,
  IRestaurantDocument,
} from "@/models/implementation/resturence.model";
import { IRestaurantReturn } from "@/types/responceResturents.type";

export interface IRestaurantServices {
  getByDistence(
    locaion: string[],
    skip?: number,
    limit?: number
  ): Promise<IRestaurantReturn>;
  deleteResturent(id: string, userid: string): Promise<void>;
  updateResturentData(
    userid: string,
    restaruantid: string,
    data: Partial<IRestaurant>
  ): Promise<IRestaurantDocument | null>;
  createResturant(
    data: IRestaurant,
    userid: string
  ): Promise<IRestaurantDocument>;
  getByuserid(
    userid: string,
    page: number,
    limit: number
  ): Promise<IRestaurantReturn>;
  getRestaurentById(id: string): Promise<IRestaurantDocument|null> 
}
