'use client'

import { useEffect, useState } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'

interface MapLocationPickerProps {
  latitude: number
  longitude: number
  onLocationChange: (lat: number, lng: number) => void
}

const containerStyle = {
  width: '100%',
  height: '400px',
}

const defaultCenter = {
  lat: -6.2088,
  lng: 106.6456, // Default Jakarta
}

export default function MapLocationPicker({
  latitude,
  longitude,
  onLocationChange,
}: MapLocationPickerProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  })

  const [markerPos, setMarkerPos] = useState({
    lat: latitude || defaultCenter.lat,
    lng: longitude || defaultCenter.lng,
  })

  useEffect(() => {
    setMarkerPos({
      lat: latitude || defaultCenter.lat,
      lng: longitude || defaultCenter.lng,
    })
  }, [latitude, longitude])

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      setMarkerPos({ lat, lng })
      onLocationChange(lat, lng)
    }
  }

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      setMarkerPos({ lat, lng })
      onLocationChange(lat, lng)
    }
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-96 bg-muted flex items-center justify-center rounded-lg border border-primary/20">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg overflow-hidden border border-primary/20">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPos}
          zoom={17}
          onClick={handleMapClick}
          options={{
            mapTypeControl: true,
            fullscreenControl: true,
            zoomControl: true,
            streetViewControl: false,
          }}
        >
          <Marker
            position={markerPos}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
            title="Click and drag to set location"
          />
        </GoogleMap>
      </div>
      <p className="text-xs text-muted-foreground">
        Click on the map or drag the marker to set your shop location
      </p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-muted-foreground text-xs">Latitude</p>
          <p className="font-mono font-semibold text-foreground">{markerPos.lat.toFixed(6)}</p>
        </div>
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-muted-foreground text-xs">Longitude</p>
          <p className="font-mono font-semibold text-foreground">{markerPos.lng.toFixed(6)}</p>
        </div>
      </div>
    </div>
  )
}
