import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import api from '../../api/axios'

// ─── Icônes personnalisées ─────────────────────────────────────────────────────
const livreurIcon = L.divIcon({
  html: `<div style="
    background:#3B82F6; color:#fff; border-radius:50%; width:36px; height:36px;
    display:flex; align-items:center; justify-content:center;
    font-size:18px; border:3px solid #fff;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);">🛵</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

const clientIcon = L.divIcon({
  html: `<div style="
    background:#EF4444; color:#fff; border-radius:50%; width:36px; height:36px;
    display:flex; align-items:center; justify-content:center;
    font-size:18px; border:3px solid #fff;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);">📍</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

// ─── Composant interne : centre la carte sur les deux marqueurs ───────────────
function FitBounds({ positions }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length === 2) {
      map.fitBounds(positions, { padding: [40, 40] })
    }
  }, [positions, map])
  return null
}

// ─── Géocoder une adresse via Nominatim (OpenStreetMap, gratuit) ──────────────
async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
  const res  = await fetch(url, { headers: { 'Accept-Language': 'fr' } })
  const data = await res.json()
  if (data.length === 0) throw new Error('Adresse introuvable')
  return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
}

// ─── Calcul d'itinéraire via OSRM (gratuit, open source) ─────────────────────
async function fetchRoute(from, to) {
  // from / to = [lat, lng]
  const url = `https://router.project-osrm.org/route/v1/driving/`
            + `${from[1]},${from[0]};${to[1]},${to[0]}`
            + `?overview=full&geometries=geojson`
  const res  = await fetch(url)
  const data = await res.json()
  if (data.code !== 'Ok') throw new Error('Itinéraire impossible')
  // GeoJSON renvoie [lng, lat], Leaflet veut [lat, lng]
  return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
}

// ─── Composant principal ──────────────────────────────────────────────────────
/**
 * Props :
 *   orderId         — pour envoyer la position GPS au backend
 *   deliveryAddress — adresse texte du client
 *   deliveryLat     — latitude (optionnel, si déjà en base)
 *   deliveryLng     — longitude (optionnel)
 */
export default function DeliveryMap({ orderId, deliveryAddress, deliveryLat, deliveryLng }) {
  const [livreurPos, setLivreurPos] = useState(null)   // [lat, lng]
  const [clientPos, setClientPos]   = useState(null)   // [lat, lng]
  const [route, setRoute]           = useState([])     // [[lat,lng], ...]
  const [status, setStatus]         = useState('Localisation en cours...')
  const [routeInfo, setRouteInfo]   = useState(null)   // { distance, duration }
  const intervalRef = useRef(null)

  // ── 1. Obtenir la position du livreur (GPS navigateur) ─────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('Géolocalisation non disponible sur ce navigateur.')
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude]
        setLivreurPos(coords)
        setStatus('')
      },
      (err) => {
        setStatus(`GPS indisponible : ${err.message}`)
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  // ── 2. Obtenir les coordonnées du client ───────────────────────────────────
  useEffect(() => {
    if (deliveryLat && deliveryLng) {
      setClientPos([parseFloat(deliveryLat), parseFloat(deliveryLng)])
    } else if (deliveryAddress) {
      geocodeAddress(deliveryAddress)
        .then((pos) => setClientPos(pos))
        .catch(() => setStatus('Adresse de livraison introuvable sur la carte.'))
    }
  }, [deliveryLat, deliveryLng, deliveryAddress])

  // ── 3. Calculer l'itinéraire quand les deux positions sont connues ─────────
  useEffect(() => {
    if (!livreurPos || !clientPos) return

    fetchRoute(livreurPos, clientPos)
      .then((polyline) => {
        setRoute(polyline)
        // Calcul approximatif distance à vol d'oiseau (fallback)
        const R = 6371
        const dLat = ((clientPos[0] - livreurPos[0]) * Math.PI) / 180
        const dLon = ((clientPos[1] - livreurPos[1]) * Math.PI) / 180
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((livreurPos[0] * Math.PI) / 180) *
          Math.cos((clientPos[0] * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2
        const distKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        setRouteInfo({ distKm: distKm.toFixed(1) })
      })
      .catch(() => {
        // En cas d'échec OSRM : tracer une ligne droite
        setRoute([livreurPos, clientPos])
      })
  }, [livreurPos, clientPos])

  // ── 4. Envoyer la position livreur au backend toutes les 10s ──────────────
  useEffect(() => {
    if (!livreurPos || !orderId) return

    const send = () => {
      api.post(`/livreur/orders/${orderId}/location`, {
        latitude:  livreurPos[0],
        longitude: livreurPos[1],
      }).catch(() => {}) // silencieux si erreur réseau
    }

    send() // immédiatement
    intervalRef.current = setInterval(send, 10000)

    return () => clearInterval(intervalRef.current)
  }, [livreurPos, orderId])

  // ── Rendu ──────────────────────────────────────────────────────────────────
  const center     = livreurPos ?? clientPos ?? [-18.9137, 47.5361] // défaut : Antananarivo
  const bothKnown  = livreurPos && clientPos

  return (
    <div>
      {/* Barre d'info au-dessus de la carte */}
      <div style={infoBarStyle}>
        {status && <span style={{ color: '#DC2626' }}>⚠ {status}</span>}
        {livreurPos && !status && <span style={{ color: '#16A34A' }}>🛵 GPS actif</span>}
        {routeInfo && (
          <span style={{ marginLeft: 'auto', fontWeight: 600 }}>
            Distance : ~{routeInfo.distKm} km
          </span>
        )}
      </div>

      {/* Carte Leaflet */}
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: 380, width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marqueur livreur */}
        {livreurPos && (
          <Marker position={livreurPos} icon={livreurIcon}>
            <Popup>📍 Votre position</Popup>
          </Marker>
        )}

        {/* Marqueur client */}
        {clientPos && (
          <Marker position={clientPos} icon={clientIcon}>
            <Popup>
              <strong>Adresse de livraison</strong><br />
              {deliveryAddress}
            </Popup>
          </Marker>
        )}

        {/* Itinéraire */}
        {route.length > 1 && (
          <Polyline
            positions={route}
            pathOptions={{ color: '#3B82F6', weight: 5, opacity: 0.85 }}
          />
        )}

        {/* Adapter le zoom aux deux marqueurs */}
        {bothKnown && <FitBounds positions={[livreurPos, clientPos]} />}
      </MapContainer>

      {/* Légende */}
      <div style={legendStyle}>
        <span>🛵 Vous</span>
        <span style={{ marginLeft: 'auto' }}>📍 Client</span>
        {route.length > 1 && (
          <span style={{ marginLeft: 12, color: '#3B82F6' }}>— Itinéraire</span>
        )}
      </div>
    </div>
  )
}

const infoBarStyle = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '8px 12px', background: '#F9FAFB',
  borderBottom: '1px solid #E5E7EB', fontSize: 13,
}

const legendStyle = {
  display: 'flex', padding: '6px 12px',
  background: '#F9FAFB', fontSize: 12, color: '#6B7280',
}
