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
  
}
