"use client"

import { useEffect, useState } from "react"
import type { IRestaurant } from "../types/restaurant"
import { fetchAllRestaurants } from "../services/api"
import RestaurantCard from "./RestaurantCard"
import RestaurantUploadModal from "./addResturent"
import axiosInstance from "../services/axios.interceptor"

const AllRestaurants = () => {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalRestaurants, setTotalRestaurants] = useState<number>(0)
  const [isopen, setIsopen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentRestaurant, setCurrentRestaurant] = useState<IRestaurant | null>(null)

  useEffect(() => {
    const loadAllRestaurants = async () => {
      try {
        setLoading(true)

        const response = await fetchAllRestaurants()
        console.log(response.data)

        // Fix: Uncomment and properly use the response data
        setRestaurants(response.data)
        setTotalPages(response.totalPages)
        setTotalRestaurants(response.total)
      } catch (error) {
        console.error("Failed to fetch all restaurants:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAllRestaurants()
  }, [currentPage])

  const accOpen = (restaurant?: IRestaurant) => {
    if (restaurant) {
      setCurrentRestaurant(restaurant)
      setEditMode(true)
    } else {
      setCurrentRestaurant(null)
      setEditMode(false)
    }
    setIsopen((prev) => !prev)
  }

  const handleSubmit = async (restaurantData: any, imageFiles: File[]) => {
    try {
      // Prepare FormData object
      const formdata = new FormData()

      // If needed, restructure coordinates before appending
      if (restaurantData.location?.coordinates) {
        restaurantData.coordinates = restaurantData.location.coordinates
      }

      // Append all primitive fields from restaurantData
      for (const key in restaurantData) {
        const value = restaurantData[key]

        // Skip null/undefined values and image array (we'll handle files separately)
        if (value === null || value === undefined || key === "image") continue

        if (typeof value === "object" && !Array.isArray(value)) {
          // Stringify objects (e.g., nested objects like coordinates)
          formdata.append(key, JSON.stringify(value))
        } else {
          if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
              formdata.append(key, value[i])
            }
          } else formdata.append(key, value)
        }
      }

      // Append image files
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formdata.append("images", file)
        })
      }

      console.log("Submitting restaurant data...")

      let res
      if (editMode && currentRestaurant) {
        // Edit existing restaurant
        res = await axiosInstance.put(`/api/restaurant/update/${currentRestaurant._id}`, formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        // Update the restaurant in the local state
        setRestaurants((prevRestaurants) =>
          prevRestaurants.map((restaurant) =>
            restaurant._id === currentRestaurant._id ? { ...restaurant, ...restaurantData } : restaurant,
          ),
        )
      } else {
        // Add new restaurant
        res = await axiosInstance.post("/api/restaurant/add", formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        // Refresh the restaurant list
        const response = await fetchAllRestaurants()
        setRestaurants(response.data)
      }

      console.log("Response:", res)
      setIsopen(false)
    } catch (error) {
      console.error("Submission failed:", error)
    }
  }

  const handleEdit = (restaurant: IRestaurant) => {
    accOpen(restaurant)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Restaurants</h1>
        <RestaurantUploadModal
          isOpen={isopen}
          onClose={() => accOpen()}
          onSubmit={handleSubmit}
          editMode={editMode}
          restaurant={currentRestaurant}
        />
        <button onClick={() => accOpen()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Add Restaurant
        </button>
      </div>

      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <p className="text-gray-700">
          Total Restaurants: <span className="font-semibold">{totalRestaurants}</span> | Page{" "}
          <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.length > 0 ? (
              restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id.toString()}
                  restaurant={restaurant}
                  onEdit={() => handleEdit(restaurant)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-lg text-gray-600">No restaurants found.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AllRestaurants
