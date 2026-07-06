'use client'

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useState, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'

// Fix for leaflet marker icons
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface MapLocationPickerProps {
  latitude: number
  longitude: number
  onLocationChange: (lat: number, lng: number) => void
}

function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], map.getZoom())
  }, [lat, lng, map])
  return null
}

export default function MapLocationPicker({
  latitude,
  longitude,
  onLocationChange,
}: MapLocationPickerProps) {
  const [markerPos, setMarkerPos] = useState<[number, number]>([latitude, longitude])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleMarkerDragEnd = (e: any) => {
    const lat = e.target.getLatLng().lat
    const lng = e.target.getLatLng().lng
    setMarkerPos([lat, lng])
    onLocationChange(lat, lng)
  }

  if (!isClient) {
    return (
      <div className="w-full h-96 bg-muted flex items-center justify-center rounded-xl border border-primary/10">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border border-primary/10 shadow-sm h-96">
        <MapContainer center={markerPos} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={markerPos}
            draggable={true}
            eventHandlers={{
              dragend: handleMarkerDragEnd,
            }}
            icon={DefaultIcon}
          />
          <MapClickHandler
            onLocationChange={(lat, lng) => {
              setMarkerPos([lat, lng])
              onLocationChange(lat, lng)
            }}
          />
          <MapUpdater lat={markerPos[0]} lng={markerPos[1]} />
        </MapContainer>
      </div>

      <p className="text-xs text-muted-foreground">
        Klik peta untuk set lokasi atau drag marker untuk memindahkan lokasi toko
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
          <p className="text-xs text-muted-foreground mb-1">Latitude</p>
          <p className="font-mono font-bold text-primary">{markerPos[0].toFixed(6)}</p>
        </div>
        <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
          <p className="text-xs text-muted-foreground mb-1">Longitude</p>
          <p className="font-mono font-bold text-primary">{markerPos[1].toFixed(6)}</p>
        </div>
      </div>
    </div>
  )
}
