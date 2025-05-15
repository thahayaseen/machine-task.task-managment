import mongoose, { Schema, Document, Types } from "mongoose";

// Subschemas
interface IAddress {
  address_line: string;
  pincode: number;
}

interface IGeoLocation {
  type: "Point";
  coordinates: [number, number];
}

// Main interface
export interface IRestaurant {
  _id: Types.ObjectId;
  name: string;
  address: IAddress;
  location: IGeoLocation;
  userid?: string | Types.ObjectId;
}

export interface IRestaurantDocument
  extends Document,
    Omit<IRestaurant, "_id"> {}

const addressSchema = new Schema<IAddress>({
  address_line: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
});

const restaurantSchema = new Schema<IRestaurantDocument>({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: addressSchema,
    required: true,
  },
  location: {
    type: {
      type: String, 
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  userid: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Add GeoIndex for geospatial queries
restaurantSchema.index({ location: "2dsphere" });

export const Restaurant = mongoose.model<IRestaurantDocument>(
  "Restaurant",
  restaurantSchema
);
