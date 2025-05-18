import type { FC } from "react";
import { Link } from "react-router-dom";
import type { IRestaurant } from "../types/restaurant";

interface RestaurantCardProps {
  restaurant: IRestaurant;
  onEdit: (val: IRestaurant) => void;
}

const RestaurantCard: FC<RestaurantCardProps> = ({ restaurant, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow text-primary">
      <div className="h-48 overflow-hidden">
        <img
          src={
            "http://localhost:4050/uploads/" + restaurant.image[0] ||
            "/placeholder.svg?height=192&width=384"
          }
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 truncate">
          {restaurant.name}
          <h2>{restaurant.image[0]}</h2>
        </h3>
        <p className="text-primary text-sm mb-2">
          {restaurant.address.address_line}
        </p>
        <p className="text-primary text-sm">
          Pin: {restaurant.address.pincode}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 inline mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {restaurant.contact}
          </span>
          <Link
            to={`/restaurant/${restaurant._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View Details
          </Link>
          <button
            onClick={() => {
              onEdit(restaurant);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
