"use client"

import type { FC } from "react"

interface LocationPromptProps {
  onRetry: () => void
}

const LocationPrompt: FC<LocationPromptProps> = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] px-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-red-500 mx-auto mb-4"
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Location Access Required</h2>
        <p className="text-gray-600 mb-4">
          We cannot continue without access to your location. Please enable location services to see restaurants near
          you.
        </p>
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

export default LocationPrompt
