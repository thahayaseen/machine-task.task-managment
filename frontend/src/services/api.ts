import type { IRestaurant } from "../types/restaurant";
import axiosInstance from "./axios.interceptor";
// import { Types } from "mongoose"

// This is a mock API service - in a real app, these would call actual API endpoints

interface ApiResponse<T> {
  data: T;
  total: number;
  totalPages: number;
  currentPage: number;
}

// Fetch restaurants based on location
export const fetchRestaurants = async (
  latitude: number,
  longitude: number,
  page: number=1
): Promise<ApiResponse<IRestaurant[]>> => {
  return await axiosInstance.get(
    "/api/restaurant?N=" + latitude + "&E=" + longitude + "&page=" + page
  );
};

// Fetch all restaurants with pagination
export const fetchAllRestaurants = async (
  page = 1,
  limit = 9
): Promise<ApiResponse<IRestaurant[]>> => {
  const data = await axiosInstance.get(
    "/api/restaurant/my-restaurant?page=" + page + "&limit=" + limit
  );
  return data.data.data;
};

// Fetch a restaurant by ID
// export const fetchRestaurantById = async (id: string): Promise<IRestaurant> => {
//   // Simulate API call
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // Generate a single dummy restaurant
//       const restaurant: IRestaurant = {
//         _id: new Types.ObjectId(id),
//         name: `Restaurant ${id.substring(0, 5)}`,
//         image: [
//           `/placeholder.svg?height=400&width=600&text=Restaurant ${id.substring(
//             0,
//             5
//           )}`,
//         ],
//         contact: Math.floor(9000000000 + Math.random() * 1000000000),
//         address: {
//           address_line: `${Math.floor(Math.random() * 100)} Main Street, City`,
//           pincode: Math.floor(100000 + Math.random() * 900000),
//         },
//         location: {
//           type: "Point",
//           coordinates: [40.7128, -74.006],
//         },
//       };

//       resolve(restaurant);
//     }, 800);
//   });
// };

// // Update a restaurant
// export const updateRestaurant = async (
//   id: string,
//   data: Partial<IRestaurant>
// ): Promise<IRestaurant> => {
//   // Simulate API call
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log("Restaurant updated:", { id, data });
//       // In a real app, this would send the data to an API
//       // Return the updated restaurant
//       resolve({
//         _id: new Types.ObjectId(id),
//         name: data.name || "",
//         image: data.image || [],
//         contact: data.contact || 0,
//         address: data.address || { address_line: "", pincode: 0 },
//         location: data.location || { type: "Point", coordinates: [0, 0] },
//       });
//     }, 1000);
//   });
// };
