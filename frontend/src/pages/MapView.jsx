import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useAuth } from '../context/AuthContext'
import '../styles/Map.css'

const MapView = () => {
  const { addVehicle, exitVehicle } = useAuth()
  const [slots, setSlots] = useState([])
  const center = [28.6139, 77.2090] // New Delhi

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/slots')
        const data = await res.json()
        // API may return array directly or wrapped in { data }
        const items = data.data || data || []
        // Ensure each slot has a position; if not, assign pseudo-positions near center
        const withPos = items.map((s, i) => {
          if (s.position && Array.isArray(s.position) && s.position.length === 2) return s
          // fallback: generate a small offset so markers don't overlap
          const lat = center[0] + (i % 5) * 0.003
          const lng = center[1] + Math.floor(i / 5) * 0.003
          return { ...s, position: [lat, lng] }
        })
        setSlots(withPos)
      } catch (err) {
        console.error('Failed to load slots', err)
      }
    }
    load()
  }, [])

  // Animation style for pulsing effect
  const pulsingCircle = {
    radius: 8,
    weight: 2,
    color: '#fff',
    fillOpacity: 0.6,
    className: 'pulsing-marker'
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[calc(100vh-2rem)]">
      <div className="card h-full">
        <h1 className="text-3xl font-bold mb-6">Parking Map</h1>

        <div className="h-[calc(100%-4rem)] rounded-lg overflow-hidden">
          <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />

            {slots.map((lot, idx) => (
              <CircleMarker
                key={lot._id || lot.id || idx}
                center={lot.position}
                {...pulsingCircle}
                fillColor={lot.isOccupied ? '#ff4d4f' : '#FFD700'}
              >
                <Popup>
                  <div className="text-gray-900 p-2">
                    <h3 className="font-bold text-lg mb-2">
                      Slot {lot.slotNumber || idx + 1}
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${lot.isOccupied ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {lot.isOccupied ? 'Occupied' : 'Available'}
                      </span>
                    </h3>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">Floor {lot.floor || 1}</p>
                      <p className="text-sm font-semibold">Rate: ₹{lot.hourlyRate || 50}/hour</p>
                    </div>

                    {!lot.isOccupied ? (
                      <button
                        className="w-full btn btn-primary text-sm group relative overflow-hidden"
                        onClick={async () => {
                          const plate = window.prompt('Enter license plate to book:')
                          if (!plate) return
                          try {
                            await addVehicle({ licensePlate: plate.toUpperCase(), vehicleType: 'car', slotId: lot._id || lot.id })
                            window.location.reload()
                          } catch (err) {
                            alert('Booking failed')
                          }
                        }}
                      >
                        <span className="relative z-10">Book Now</span>
                        <div className="absolute inset-0 bg-white/20 transform translate-y-full transition-transform group-hover:translate-y-0"></div>
                      </button>
                    ) : (
                      <button
                        className="w-full btn btn-outline text-sm border-red-500 text-red-500 hover:bg-red-50"
                        onClick={async () => {
                          if (!window.confirm('Are you sure you want to exit this vehicle?')) return
                          const vehicleId = lot.currentVehicle || null
                          if (!vehicleId) {
                            alert('No vehicle to exit for this slot')
                            return
                          }
                          try {
                            await exitVehicle(vehicleId)
                            window.location.reload()
                          } catch (err) {
                            alert('Exit failed')
                          }
                        }}
                      >
                        Exit Vehicle
                      </button>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </motion.div>
  )
}

export default MapView