import { z } from "zod";
import { Types } from "mongoose";

// Zod schema for IAddress
const addressSchema = z.object({
  address_line: z.string().min(1, "Address line is required"),
  pincode: z.number().int().positive("Pincode must be a positive number"),
});

// Main Zod schema for IRestaurant
export const restaurantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  coordinates: z.tuple([
    z.coerce.number().min(-180).max(180), // Longitude (valid range)
    z.coerce.number().min(-90).max(90), // Latitude (valid range)
  ]),
  address: z.string(),
});

export type RestaurantInput = z.infer<typeof restaurantSchema>;
