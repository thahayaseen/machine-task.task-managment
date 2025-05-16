import {
  IRestaurant,
  IRestaurantDocument,
} from "@/models/implementation/resturence.model";

export interface IRestaurantServices {
  getDistence(locaion: string[]): Promise<IRestaurantDocument[]>;
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
}
