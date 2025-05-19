"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { X, Upload, MapPin, Search } from "lucide-react";
import "./RestaurantUploadModal.css";

// Define interfaces for restaurant data
interface IAddress {
  address_line: string;
  pincode: number;
}

interface IGeoLocation {
  type: "Point";
  coordinates: [number, number];
}

interface IRestaurant {
  _id?: string;
  name: string;
  image: string[];
  contact: number;
  address: IAddress;
  location: IGeoLocation;
  userid?: string;
}

interface RestaurantUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (restaurantData: IRestaurant, imageFiles: File[]) => void;
  editMode?: boolean;
  restaurant?: IRestaurant | null;
}

const RestaurantUploadModal = ({
  isOpen,
  onClose,
  onSubmit,
  editMode = false,
  restaurant = null,
}: RestaurantUploadModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);

  // Form state
  const [formData, setFormData] = useState<IRestaurant>({
    name: "",
    image: [],
    contact: 0,
    address: {
      address_line: "",
      pincode: 0,
    },
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data for edit mode
  useEffect(() => {
    if (isOpen && editMode && restaurant) {
      setFormData({
        ...restaurant,
        image: restaurant.image || [],
      });

      // Set image previews if available
      if (restaurant.image && restaurant.image.length > 0) {
        setImagePreviews(restaurant.image);
      }
    } else if (isOpen && !editMode) {
      // Reset form for new restaurant
      setFormData({
        name: "",
        image: [],
        contact: 0,
        address: {
          address_line: "",
          pincode: 0,
        },
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
      });
      setImageFiles([]);
      setImagePreviews([]);
      setFormErrors({});
    }
  }, [isOpen, editMode, restaurant]);

  // Initialize map
  useEffect(() => {
    if (isOpen && mapRef.current && !map) {
      // Default coordinates (can be set to user's current location)
      const defaultLocation = {
        lat:
          editMode && restaurant?.location?.coordinates?.[0]
            ? restaurant.location.coordinates[0]
            : 28.6139,
        lng:
          editMode && restaurant?.location?.coordinates?.[1]
            ? restaurant.location.coordinates[1]
            : 77.209,
      };

      // Load Google Maps script if not already loaded
      if (!window.google || !window.google.maps) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${
          import.meta.env.VITE_GOOGLEMAP
        }&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => initializeMap(defaultLocation);
        document.head.appendChild(script);
      } else {
        initializeMap(defaultLocation);
      }
    }
  }, [isOpen, map, editMode, restaurant]);

  // Initialize map function
  const initializeMap = (defaultLocation: { lat: number; lng: number }) => {
    if (!mapRef.current) return;

    const mapOptions = {
      center: defaultLocation,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    };

    const newMap = new google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    const newMarker = new google.maps.Marker({
      position: defaultLocation,
      map: newMap,
      draggable: true,
      title: "Restaurant Location",
      animation: google.maps.Animation.DROP,
    });
    setMarker(newMarker);

    // Update coordinates when marker is dragged
    google.maps.event.addListener(newMarker, "dragend", () => {
      const position = newMarker.getPosition();
      if (position) {
        updateLocationAndAddress(position.lat(), position.lng());
      }
    });

    // Allow clicking on map to move marker
    google.maps.event.addListener(newMap, "click", (event) => {
      newMarker.setPosition(event.latLng);
      updateLocationAndAddress(event.latLng.lat(), event.latLng.lng());
    });

    // Handle double click on map to update address
    google.maps.event.addListener(newMap, "dblclick", (event) => {
      newMarker.setPosition(event.latLng);
      updateLocationAndAddress(event.latLng.lat(), event.latLng.lng(), true);
    });

    // Initialize with default location
    updateLocationAndAddress(defaultLocation.lat, defaultLocation.lng);

    // Add search box
    if (searchBoxRef.current) {
      const searchBoxInstance = new google.maps.places.SearchBox(
        searchBoxRef.current
      );
      setSearchBox(searchBoxInstance);

      newMap.addListener("bounds_changed", () => {
        searchBoxInstance.setBounds(
          newMap.getBounds() as google.maps.LatLngBounds
        );
      });

      // Fix: Prevent event propagation to avoid closing modal
      searchBoxRef.current.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      searchBoxInstance.addListener("places_changed", () => {
        const places = searchBoxInstance.getPlaces();
        if (places && places.length > 0) {
          const place = places[0];
          if (place.geometry && place.geometry.location) {
            newMap.setCenter(place.geometry.location);
            newMarker.setPosition(place.geometry.location);

            // Extract pincode from address components
            let pincode = 0;
            if (place.address_components) {
              for (const component of place.address_components) {
                if (component.types.includes("postal_code")) {
                  pincode = Number.parseInt(component.long_name) || 0;
                  break;
                }
              }
            }

            setFormData((prev) => ({
              ...prev,
              location: {
                type: "Point",
                coordinates: [
                  place.geometry.location.lat(),
                  place.geometry.location.lng(),
                ],
              },
              address: {
                address_line:
                  place.formatted_address || prev.address.address_line,
                pincode: pincode || prev.address.pincode,
              },
            }));
          }
        }
      });
    }
  };

  // Helper function to update location and fetch address if needed
  const updateLocationAndAddress = (
    lat: number,
    lng: number,
    fetchAddress = false
  ) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        type: "Point",
        coordinates: [lat, lng],
      },
    }));

    if (fetchAddress && window.google) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const place = results[0];

          // Extract pincode from address components
          let pincode = 0;
          if (place.address_components) {
            for (const component of place.address_components) {
              if (component.types.includes("postal_code")) {
                pincode = Number.parseInt(component.long_name) || 0;
                break;
              }
            }
          }

          setFormData((prev) => ({
            ...prev,
            address: {
              address_line:
                place.formatted_address || prev.address.address_line,
              pincode: pincode || prev.address.pincode,
            },
          }));
        }
      });
    }
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "address_line") {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          address_line: value,
        },
      }));
    } else if (name === "pincode") {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          pincode: Number.parseInt(value) || 0,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "contact" ? Number.parseInt(value) || 0 : value,
      }));
    }

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setImageFiles((prev) => [...prev, ...newFiles]);

      // Create previews for new files
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Restaurant name is required";
    if (!formData.contact) errors.contact = "Contact number is required";
    if (formData.contact && formData.contact.toString().length !== 10)
      errors.contact = "Contact number must be 10 digits";
    if (!formData.address.address_line.trim())
      errors.address_line = "Address is required";
    if (!formData.address.pincode) errors.pincode = "Pincode is required";
    if (
      formData.address.pincode &&
      formData.address.pincode.toString().length !== 6
    )
      errors.pincode = "Pincode must be 6 digits";

    // Validate images only for new restaurants
    if (!editMode && imageFiles.length === 0) {
      errors.image = "At least one image is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Only send image files if there are any
      onSubmit(formData, imageFiles);

      setIsSubmitting(false);
      mapRef.current = null;
      setMap(null);
      onClose();
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        mapRef.current = null;
        setMap(null);
        onClose();
      }
    };

    // Close modal when pressing Escape key
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        mapRef.current = null;
        setMap(null);
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleEscKey);
      // Prevent scrolling of background content
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="restaurant-modal-overlay">
      <div ref={modalRef} className="restaurant-modal">
        <div className="restaurant-modal-header">
          <h2>{editMode ? "Edit Restaurant" : "Add New Restaurant"}</h2>
          <button
            className="restaurant-modal-close"
            onClick={() => {
              mapRef.current = null;
              setMap(null);
              onClose();
            }}>
            <X size={20} />
          </button>
        </div>

        <div className="restaurant-modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Left column - Restaurant details */}
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="name">Restaurant Name*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={formErrors.name ? "error" : "text-primary"}
                    placeholder="Enter restaurant name"
                  />
                  {formErrors.name && (
                    <span className="error-message">{formErrors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="contact">Contact Number*</label>
                  <input
                    type="number"
                    id="contact"
                    name="contact"
                    value={formData.contact || ""}
                    onChange={handleChange}
                    className={formErrors.contact ? "error" : "text-primary"}
                    placeholder="10-digit contact number"
                  />
                  {formErrors.contact && (
                    <span className="error-message">{formErrors.contact}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="address_line">Address*</label>
                  <textarea
                    id="address_line"
                    name="address_line"
                    value={formData.address.address_line}
                    onChange={handleChange}
                    className={
                      formErrors.address_line ? "error" : "text-primary"
                    }
                    placeholder="Full address"
                  />
                  {formErrors.address_line && (
                    <span className="error-message">
                      {formErrors.address_line}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="pincode">Pincode*</label>
                  <input
                    type="number"
                    id="pincode"
                    name="pincode"
                    value={formData.address.pincode || ""}
                    onChange={handleChange}
                    className={formErrors.pincode ? "error" : "text-primary"}
                    placeholder="6-digit pincode"
                  />
                  {formErrors.pincode && (
                    <span className="error-message">{formErrors.pincode}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Restaurant Images{!editMode && "*"}</label>
                  <div className="image-upload-container">
                    <label htmlFor="image" className="image-upload-button">
                      <Upload size={16} />
                      <span>Upload Images</span>
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      multiple
                      className="hidden-input"
                    />
                    {formErrors.image && (
                      <span className="error-message">{formErrors.image}</span>
                    )}
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="image-previews">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="image-preview-item">
                          <img
                            src={preview || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                          />
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => handleRemoveImage(index)}>
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right column - Map */}
              <div className="form-column">
                <div className="form-group search-container">
                  <label htmlFor="map-search">Search Location</label>
                  <div className="search-input-wrapper">
                    <Search size={16} className="search-icon" />
                    <input
                      type="text"
                      id="map-search"
                      ref={searchBoxRef}
                      placeholder="Search for a location..."
                      onClick={(e) => e.stopPropagation()} // Prevent modal close
                    />
                  </div>
                </div>

                <div className="map-container" ref={mapRef}></div>

                <div className="coordinates-display">
                  <MapPin size={16} className="coordinates-icon" />
                  <p>
                    <strong>Selected Coordinates:</strong> Lat:{" "}
                    {formData.location.coordinates[0].toFixed(6)}, Lng:{" "}
                    {formData.location.coordinates[1].toFixed(6)}
                  </p>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  mapRef.current = null;
                  setMap(null);
                  onClose();
                }}>
                Cancel
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : editMode
                  ? "Update Restaurant"
                  : "Save Restaurant"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestaurantUploadModal;
