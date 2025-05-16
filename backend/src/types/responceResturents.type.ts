import { IRestaurantDocument } from "@/models/implementation/resturence.model";

export interface IRestaurantReturn{
    page:number,
    data:IRestaurantDocument[]
}