"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { IRestaurant } from "../types/restaurant"
import { fetchRestaurantById, updateRestaurant } from "../services/api"

interface RestaurantFormData {
  name: string
  contact: number
  address_line: string
  pincode: number
  latitude: number
  longitude: number
  image: string[]
}

const EditRestaurant = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: "",
    contact: 0,
    address_line: "",
    pincode: 0,
    latitude: 0,
    longitude: 0,
    image: [""],
  })

  useEffect(() => {
    const loadRestaurant = async () => {
      if (!id) return

      try {
        setLoading(true)
        const restaurant = await fetchRestaurantById(id)

        setFormData({
          name: restaurant.name,
          contact: restaurant.contact,
          address_line: restaurant.address.address_line,
          pincode: restaurant.address.pincode,
          latitude: restaurant.location.coordinates[0],
          longitude: restaurant.location.coordinates[1],
          image: restaurant.image,
        })
      } catch (error) {
        console.error("Failed to fetch restaurant:", error)
        setError("Failed to load restaurant data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadRestaurant()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!id) return

    try {
      setSubmitting(true)
      setError(null)

      const restaurantData: Partial<IRestaurant> = {
        name: formData.name,
        contact: formData.contact,
        address: {
          address_line: formData.address_line,
          pincode: formData.pincode,
        },
        location: {
          type: "Point",
          coordinates: [formData.latitude, formData.longitude],
        },
        image: formData.image,
      }

      await updateRestaurant(id, restaurantData)
      navigate(`/restaurants/${id}`)
    } catch (error) {
      console.error("Failed to update restaurant:", error)
      setError("Failed to update restaurant. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Restaurant</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Restaurant Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="contact" className="block text-gray-700 font-medium mb-2">
            Contact Number
          </label>
          <input
            type="number"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address_line" className="block text-gray-700 font-medium mb-2">
            Address
          </label>
          <textarea
            id="address_line"
            name="address_line"
            value={formData.address_line}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="pincode" className="block text-gray-700 font-medium mb-2">
              Pincode
            </label>
            <input
              type="number"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
              Image URL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image[0]}
              onChange={(e) => setFormData((prev) => ({ ...prev, image: [e.target.value] }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="latitude" className="block text-gray-700 font-medium mb-2">
              Latitude
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              step="any"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="longitude" className="block text-gray-700 font-medium mb-2">
              Longitude
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              step="any"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditRestaurant
