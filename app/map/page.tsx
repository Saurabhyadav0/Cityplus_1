"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export default function MapPage() {
  const searchParams = useSearchParams()
  const lat = parseFloat(searchParams.get("lat") || "0")
  const lng = parseFloat(searchParams.get("lng") || "0")

  useEffect(() => {
    const map = L.map("map").setView([lat, lng], 15)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map)

    L.marker([lat, lng]).addTo(map).bindPopup("Complaint Location").openPopup()

    return () => {
      map.remove()
    }
  }, [lat, lng])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div id="map" style={{ height: "80vh", width: "90vw" }}></div>
    </div>
  )
}
