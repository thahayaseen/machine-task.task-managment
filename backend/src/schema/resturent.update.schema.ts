import { z } from "zod";
import { Types } from "mongoose";

export const updateRestaurantSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  coordinates: z
    .tuple([
      z.coerce.number().min(-180).max(180), // Longitude (valid range)
      z.coerce.number().min(-90).max(90), // Latitude (valid range)
    ])
    .optional(),
});

export type RestaurantInput = z.infer<typeof updateRestaurantSchema>;
