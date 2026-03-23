import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import api from '../../api/axios'

// Configurer Laravel Echo + Reverb (WebSocket)
window.Pusher = Pusher
const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST ?? 'localhost',
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
  forceTLS: false,
  enabledTransports: ['ws'],
})

export default function TrackOrder({ orderId }) {
  const [order, setOrder] = useState(null)
  const [position, setPosition] = useState(null)

  useEffect(() => {
    api.get(`/client/orders/${orderId}`).then(({ data }) => {
      setOrder(data)
      if (data.last_location) {
        setPosition([data.last_location.latitude, data.last_location.longitude])
      }
    })

    // Écouter les mises à jour GPS en temps réel
    const channel = echo.channel(`delivery.${orderId}`)
    channel.listen('.location.updated', (data) => {
      setPosition([data.latitude, data.longitude])
    })

    return () => echo.leaveChannel(`delivery.${orderId}`)
  }, [orderId])

  if (!order) return <div>Chargement...</div>

  return (
    <div className="track-order">
      <h2>Suivi commande #{order.id}</h2>
      <p>Statut : <strong>{order.status}</strong></p>
      <p>Catégorie : {order.category?.name}</p>

      {position ? (
        <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position}>
            <Popup>Position du livreur</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>En attente de la position du livreur...</p>
      )}
    </div>
  )
}
