import {
  IRestaurant,
  IRestaurantDocument,
  Restaurant,
} from "@/models/implementation/resturence.model";
import { BaseRepository } from "../basic.repository";
import { IRestaurantRepository } from "../interface/IResturent.repository";

export class RestaurantRepository
  extends BaseRepository<IRestaurantDocument>
  implements IRestaurantRepository
{
  constructor() {
    super(Restaurant);
  }
  async getByDistence(code: string[]): Promise<IRestaurantDocument[]> {
    const userLocation = {
      type: "Point",
      coordinates: code,
    };
    const filer = {
      location: {
        $near: {
          $geometry: userLocation,
          $maxDistance: 5000,
        },
      },
    };
    return await this.find(filer);
  }
}
