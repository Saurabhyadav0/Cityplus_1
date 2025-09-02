"use client";

import { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  MarkerF,
} from "@react-google-maps/api";

interface MapProps {
  location: string;
  onSelect: (address: string, lat: number, lng: number) => void;
}

const libraries: "places"[] = ["places"]; // keep static

export default function LocationPicker({ location, onSelect }: MapProps) {
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.209 }); // Default Delhi
  const [inputValue, setInputValue] = useState(location);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!location && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          setMapCenter({ lat, lng });

          try {
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
            );
            const data = await res.json();

            // ✅ Always prefer full address if available
            const address =
              data.results?.[0]?.formatted_address ||
              `${lat.toFixed(5)}, ${lng.toFixed(5)}`; // fallback to lat,lng if no address

            setInputValue(address);
            onSelect(address, lat, lng);
          } catch {
            // Final fallback: just use coordinates
            const coords = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            setInputValue(coords);
            onSelect(coords, lat, lng);
          }

          setLoadingLocation(false);
        },
        () => {
          console.warn("Geolocation denied/unavailable");
          setLoadingLocation(false);
        }
      );
    } else {
      // If a location already exists, show that
      setInputValue(location);
      setLoadingLocation(false);
    }
  }, [location, onSelect]);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name;

        setMapCenter({ lat, lng });
        setInputValue(address ?? "");
        onSelect(address ?? "", lat, lng);
      }
    }
  };

  return (
    <div className="space-y-2">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
        libraries={libraries}
      >
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              loadingLocation
                ? "Detecting current location..."
                : "Search for a location"
            }
            className="w-full border p-2 rounded"
          />
        </Autocomplete>

        <div className="h-64 w-full rounded overflow-hidden mt-2">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={mapCenter}
            zoom={14}
          >
            <MarkerF position={mapCenter} />
          </GoogleMap>
        </div>
      </LoadScript>
    </div>
  );
}
