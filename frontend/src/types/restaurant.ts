import type { Types } from "mongoose"

interface IAddress {
  address_line: string
  pincode: number
}

interface IGeoLocation {
  type: "Point"
  coordinates: [number, number]
}

// Main interface
export interface IRestaurant {
  _id: Types.ObjectId
  name: string
  image: string[]
  contact: number
  address: IAddress
  location: IGeoLocation
  userid?: string | Types.ObjectId
}
