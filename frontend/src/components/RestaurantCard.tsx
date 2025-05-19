import { FC, useState } from "react";
import { Link } from "react-router-dom";
import type { IRestaurant } from "../types/restaurant";
import axiosInstance from "../services/axios.interceptor";

interface RestaurantCardProps {
  restaurant: IRestaurant;
  onEdit: (val: IRestaurant) => void;
  inMy: boolean;
  handleDelete: (id: string) => void;
}

const RestaurantCard: FC<RestaurantCardProps> = ({
  restaurant,
  onEdit,
  inMy,
  handleDelete,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = async () => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      await axiosInstance.delete("/api/restaurant/" + restaurant._id);
      handleDelete(restaurant._id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 text-primary relative">
      {/* Image Section with Overlay for Restaurant Type */}
      <div className="h-52 overflow-hidden relative">
        <img
          src={
            restaurant.image && restaurant.image[0]
              ? `http://localhost:4050/uploads/${restaurant.image[0]}`
              : "/placeholder.svg?height=192&width=384"
          }
          alt={restaurant.name}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
          {restaurant.restaurantType || "Restaurant"}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 truncate text-blue-800">
          {restaurant.name}
        </h3>
        <div className="flex items-center mb-3 text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-sm">
            {restaurant.address.address_line}
          </p>
        </div>
        <div className="flex items-center mb-4 text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm">
            Pin: {restaurant.address.pincode}
          </p>
        </div>

        <div className="flex items-center text-gray-700 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span className="text-sm">{restaurant.contact}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <Link
            to={`/restaurant/${restaurant._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors duration-200"
          >
            <span>View Details</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </Link>
          
          {inMy && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(restaurant)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                  />
                </svg>
                Edit
              </button>
              
              {showDeleteConfirm ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {isDeleting ? "Deleting..." : "Confirm"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;