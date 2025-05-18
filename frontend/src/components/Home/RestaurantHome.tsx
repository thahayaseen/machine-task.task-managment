"use client"

import { useEffect, useState } from "react"
import type { IRestaurant } from "../../types/restaurant"
import { fetchRestaurants } from "../../services/api"
import RestaurantCard from "../RestaurantCard"
import LocationPrompt from "../LocationPrompt"

const RestaurantHome = () => {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [locationGranted, setLocationGranted] = useState<boolean | null>(null)
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null)

  useEffect(() => {
    // Request location permission
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords: [number, number] = [position.coords.latitude, position.coords.longitude]
            setCoordinates(coords)
            setLocationGranted(true)
          },
          (error) => {
            console.error("Error getting location:", error)
            setLocationGranted(false)
            setLoading(false)
          },
        )
      } else {
        setLocationGranted(false)
        setLoading(false)
      }
    }

    getLocation()
  }, [])

  useEffect(() => {
    const loadRestaurants = async () => {
      if (coordinates) {
        try {
          setLoading(true)
          // Call API with latitude and longitude
          const [latitude, longitude] = coordinates
          const response = await fetchRestaurants(latitude, longitude)
     
          
          setRestaurants(response.data.data.data)
        } catch (error) {
          console.error("Failed to fetch restaurants:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    if (coordinates) {
      loadRestaurants()
    }
  }, [coordinates])

  if (locationGranted === false) {
    return <LocationPrompt onRetry={() => window.location.reload()} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Restaurants Near You</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => <RestaurantCard key={restaurant._id.toString()} restaurant={restaurant} />)
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-gray-600">No restaurants found in your area.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RestaurantHome
