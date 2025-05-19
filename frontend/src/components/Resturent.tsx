"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Clock,
  ChevronLeft,
  Star,
  ExternalLink,
  Edit,
} from "lucide-react";
import axiosInstance from "../services/axios.interceptor";
import "./RestaurantDetails.css";

interface IAddress {
  address_line: string;
  pincode: number;
}

interface IGeoLocation {
  type: "Point";
  coordinates: [number, number];
}

interface IRestaurant {
  _id: string;
  name: string;
  image: string[];
  contact: number;
  address: IAddress;
  location: IGeoLocation;
  userid?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get(`/api/restaurant/${id}`);
        console.log(response);

        setRestaurant(response.data.data);
      } catch (err) {
        console.error("Failed to fetch restaurant details:", err);
        setError("Failed to load restaurant details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRestaurantDetails();
    }
  }, [id]);

  // Initialize map when restaurant data is available
  useEffect(() => {
    if (restaurant && restaurant.location && !map) {
      const mapContainer = document.getElementById("restaurant-map");

      if (mapContainer) {
        // Load Google Maps script if not already loaded
        if (!window.google || !window.google.maps) {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLEMAP}&libraries=places`;
          script.async = true;
          script.defer = true;
          script.onload = () => initializeMap();
          document.head.appendChild(script);
        } else {
          initializeMap();
        }
      }
    }
  }, [restaurant, map]);

  const initializeMap = () => {
    if (!restaurant || !restaurant.location) return;

    const mapContainer = document.getElementById("restaurant-map");
    if (!mapContainer) return;

    const [lat, lng] = restaurant.location.coordinates;

    const mapOptions = {
      center: { lat, lng },
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    };

    const newMap = new window.google.maps.Map(mapContainer, mapOptions);
    setMap(newMap);

    // Add marker for restaurant location
    new window.google.maps.Marker({
      position: { lat, lng },
      map: newMap,
      title: restaurant.name,
      animation: window.google.maps.Animation.DROP,
    });
  };

  const handleImageClick = (index: number) => {
    setActiveImageIndex(index);
  };

  const handlePrevImage = () => {
    if (restaurant && restaurant.image.length > 0) {
      setActiveImageIndex((prev) =>
        prev === 0 ? restaurant.image.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (restaurant && restaurant.image.length > 0) {
      setActiveImageIndex((prev) =>
        prev === restaurant.image.length - 1 ? 0 : prev + 1
      );
    }
  };

  const openGoogleMaps = () => {
    if (restaurant && restaurant.location) {
      const [lat, lng] = restaurant.location.coordinates;
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        "_blank"
      );
    }
  };

  if (loading) {
    return (
      <div className="restaurant-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading restaurant details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="restaurant-details-error">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/restaurants" className="back-button">
          <ChevronLeft size={16} />
          Back to Restaurants
        </Link>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="restaurant-details-error">
        <h2>Restaurant Not Found</h2>
        <p>
          The restaurant you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/restaurants" className="back-button">
          <ChevronLeft size={16} />
          Back to Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="restaurant-details-container">
      {/* <div className="restaurant-details-header">
        <Link to="/restaurants" className="back-button">
          <ChevronLeft size={16} />
          Back to Restaurants
        </Link>
        <Link to={`/restaurants/edit/${restaurant._id}`} className="edit-button">
          <Edit size={16} />
          Edit Restaurant
        </Link>
      </div> */}

      <div className="restaurant-details-content">
        <div className="restaurant-details-gallery">
          <div className="restaurant-main-image">
            {restaurant.image && restaurant.image.length > 0 ? (
              <>
                <img
                  src={
                    import.meta.env.VITE_BAKEND +
                      "/uploads/" +
                      restaurant.image[activeImageIndex] || "/placeholder.svg"
                  }
                  alt={`${restaurant.name} - Image ${activeImageIndex + 1}`}
                />
                {restaurant.image.length > 1 && (
                  <>
                    <button
                      className="gallery-nav prev"
                      onClick={handlePrevImage}>
                      ‹
                    </button>
                    <button
                      className="gallery-nav next"
                      onClick={handleNextImage}>
                      ›
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="no-image">No images available</div>
            )}
          </div>

          {restaurant.image && restaurant.image.length > 1 && (
            <div className="restaurant-thumbnails">
              {restaurant.image.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${
                    index === activeImageIndex ? "active" : ""
                  }`}
                  onClick={() => handleImageClick(index)}>
                  <img
                    src={
                      import.meta.env.VITE_BAKEND+"/uploads/" + img ||
                      "/placeholder.svg"
                    }
                    alt={`${restaurant.name} - Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="restaurant-details-info">
          <h1 className="restaurant-name">{restaurant.name}</h1>

          <div className="restaurant-rating">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={star <= 4 ? "filled" : ""}
                />
              ))}
            </div>
            <span className="rating-value">4.0</span>
            <span className="rating-count">(120 reviews)</span>
          </div>

          <div className="restaurant-meta">
            <div className="meta-item">
              <MapPin size={18} />
              <p>{restaurant.address.address_line}</p>
            </div>
            <div className="meta-item">
              <Phone size={18} />
              <p>{restaurant.contact}</p>
            </div>
            <div className="meta-item">
              <Clock size={18} />
              <p>Open: 10:00 AM - 10:00 PM</p>
            </div>
          </div>

          <div className="restaurant-description">
            <h2>About</h2>
            <p>
              {restaurant.description ||
                `${
                  restaurant.name
                } is a popular dining destination located in ${
                  restaurant.address.address_line.split(",")[0]
                }. Visit us for a delightful culinary experience.`}
            </p>
          </div>

          <div className="restaurant-actions">
            <a
              href={`tel:${restaurant.contact}`}
              className="action-button call">
              <Phone size={16} />
              Call
            </a>
            <button
              onClick={openGoogleMaps}
              className="action-button directions">
              <MapPin size={16} />
              Directions
            </button>
            <a href="#" className="action-button share">
              <ExternalLink size={16} />
              Share
            </a>
          </div>
        </div>
      </div>

      <div className="restaurant-details-map-section">
        <h2>Location</h2>
        <div id="restaurant-map" className="restaurant-map"></div>
        <div className="map-address">
          <MapPin size={18} />
          <p>{restaurant.address.address_line}</p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
