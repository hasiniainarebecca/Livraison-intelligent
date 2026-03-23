import { useEffect, useState, useRef, useCallback } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, SafeAreaView, Linking,
} from 'react-native'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import { useNavigation } from '@react-navigation/native'
import api from '../../api/axios'

const STATUS_LABEL = {
  'en_attente': 'En attente',
  'validée':    'Validée',
  'en_cours':   'En livraison',
  'livrée':     'Livrée',
  'annulée':    'Annulée',
}

// ─── Géocoder via Nominatim ──────────────────────────────────────────────────
async function geocodeAddress(address) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
    const res  = await fetch(url, { headers: { 'Accept-Language': 'fr' } })
    const data = await res.json()
    if (data.length === 0) return null
    return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) }
  } catch {
    return null
  }
}

// ─── Itinéraire OSRM ─────────────────────────────────────────────────────────
async function fetchOSRMRoute(from, to) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=geojson`
    const res  = await fetch(url)
    const data = await res.json()
    if (data.code !== 'Ok') return null
    return data.routes[0].geometry.coordinates.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))
  } catch {
    return null
  }
}

export default function MissionDetailScreen({ route }) {
  const { missionId } = route.params
  const navigation    = useNavigation()

  const [order, setOrder]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [showMap, setShowMap]     = useState(false)

  // GPS livreur
  const [livreurPos, setLivreurPos] = useState(null)
  const [gpsStatus, setGpsStatus]   = useState('GPS en attente...')

  // Destination client
  const [clientPos, setClientPos] = useState(null)
  const [route2, setRoute2]       = useState([])
  const [distKm, setDistKm]       = useState(null)

  // OTP
  const [otpInput, setOtpInput]   = useState('')
  const [otpError, setOtpError]   = useState(null)
  const [otpLoading, setOtpLoading] = useState(false)

  const [actionLoading, setActionLoading] = useState(false)

  const mapRef = useRef(null)
  const locationSub = useRef(null)
  const sendInterval = useRef(null)

  // ── Charger la commande ────────────────────────────────────────────────────

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(`/livreur/orders/${missionId}`)
      setOrder(data)
    } catch {
      Alert.alert('Erreur', 'Impossible de charger la mission.')
      navigation.goBack()
    } finally {
      setLoading(false)
    }
  }, [missionId])

  useEffect(() => { load() }, [load])

  // ── GPS Livreur (expo-location) ────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false

    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') {
        setGpsStatus('Permission GPS refusée.')
        return
      }

      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10, timeInterval: 5000 },
        (loc) => {
          if (cancelled) return
          const pos = { latitude: loc.coords.latitude, longitude: loc.coords.longitude }
          setLivreurPos(pos)
          setGpsStatus('GPS actif 🛵')
        }
      ).then((sub) => { locationSub.current = sub })
    })

    return () => {
      cancelled = true
      locationSub.current?.remove()
    }
  }, [])

  // ── Envoyer position au backend toutes les 10s ─────────────────────────────

  useEffect(() => {
    if (!livreurPos || !missionId) return
    const send = () => {
      api.post(`/livreur/orders/${missionId}/location`, {
        latitude:  livreurPos.latitude,
        longitude: livreurPos.longitude,
      }).catch(() => {})
    }
    send()
    sendInterval.current = setInterval(send, 10000)
    return () => clearInterval(sendInterval.current)
  }, [livreurPos, missionId])

  // ── Géocoder l'adresse de livraison ───────────────────────────────────────

  useEffect(() => {
    if (!order) return
    if (order.delivery_lat && order.delivery_lng) {
      setClientPos({ latitude: parseFloat(order.delivery_lat), longitude: parseFloat(order.delivery_lng) })
    } else if (order.delivery_address) {
      geocodeAddress(order.delivery_address).then((pos) => { if (pos) setClientPos(pos) })
    }
  }, [order])

  // ── Calculer l'itinéraire OSRM ─────────────────────────────────────────────

  useEffect(() => {
    if (!livreurPos || !clientPos) return
    fetchOSRMRoute(livreurPos, clientPos).then((polyline) => {
      if (polyline) {
        setRoute2(polyline)
      } else {
        setRoute2([livreurPos, clientPos])
      }
      // Distance à vol d'oiseau
      const R = 6371
      const dLat = ((clientPos.latitude - livreurPos.latitude) * Math.PI) / 180
      const dLon = ((clientPos.longitude - livreurPos.longitude) * Math.PI) / 180
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(livreurPos.latitude * Math.PI / 180) * Math.cos(clientPos.latitude * Math.PI / 180) * Math.sin(dLon / 2) ** 2
      setDistKm((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1))
    })
  }, [livreurPos, clientPos])

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleStart = () => {
    Alert.alert('Démarrer la livraison', 'Confirmer le démarrage ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Démarrer',
        onPress: async () => {
          setActionLoading(true)
          try {
            await api.put(`/livreur/orders/${missionId}/start`)
            await load()
          } catch (err) {
            Alert.alert('Erreur', err.response?.data?.message ?? 'Erreur.')
          } finally {
            setActionLoading(false)
          }
        },
      },
    ])
  }

  const handleDeliver = async () => {
    if (otpInput.length < 6) return
    setOtpError(null)
    setOtpLoading(true)
    try {
      await api.put(`/livreur/orders/${missionId}/deliver`, { otp_code: otpInput })
      Alert.alert('Livraison confirmée !', 'La commande a bien été livrée.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ])
    } catch (err) {
      setOtpError(err.response?.data?.message ?? 'Code OTP incorrect.')
    } finally {
      setOtpLoading(false)
    }
  }

  // ── Rendu ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 60 }} />
      </SafeAreaView>
    )
  }

  if (!order) return null

  const client = order.client
  const statusBg    = order.status === 'en_cours' ? '#DBEAFE' : '#FEF3C7'
  const statusColor = order.status === 'en_cours' ? '#1D4ED8' : '#B45309'

  const initialRegion = livreurPos
    ? { ...livreurPos, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : { latitude: -18.9137, longitude: 47.5361, latitudeDelta: 0.1, longitudeDelta: 0.1 }

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        {/* Statut */}
        <View style={s.statusRow}>
          <Text style={s.titleText}>Commande #{order.id}</Text>
          <View style={[s.statusBadge, { backgroundColor: statusBg }]}>
            <Text style={[s.statusText, { color: statusColor }]}>
              {STATUS_LABEL[order.status] ?? order.status}
            </Text>
          </View>
        </View>

        {/* Carte client + adresses */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>📍 Client & Livraison</Text>

          <View style={s.infoRow}>
            <Text style={s.label}>Nom</Text>
            <Text style={s.value}>{client?.name ?? '—'}</Text>
          </View>

          {client?.phone && (
            <View style={s.infoRow}>
              <Text style={s.label}>Téléphone</Text>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${client.phone}`)}>
                <Text style={s.phone}>📞 {client.phone}</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={s.divider} />

          <View style={s.addrRow}>
            <View style={[s.dot, { backgroundColor: '#22C55E' }]} />
            <View style={{ flex: 1 }}>
              <Text style={s.addrLabel}>Enlèvement</Text>
              <Text style={s.addrValue}>{order.pickup_address}</Text>
            </View>
          </View>
          <View style={s.connector} />
          <View style={s.addrRow}>
            <View style={[s.dot, { backgroundColor: '#EF4444' }]} />
            <View style={{ flex: 1 }}>
              <Text style={s.addrLabel}>Livraison</Text>
              <Text style={s.addrValue}>{order.delivery_address}</Text>
            </View>
          </View>

          {order.notes ? (
            <View style={s.notesBox}>
              <Text style={s.notes}>{order.notes}</Text>
            </View>
          ) : null}
        </View>

        {/* Bouton carte */}
        <TouchableOpacity
          style={[s.mapBtn, { backgroundColor: showMap ? '#6B7280' : '#3B82F6' }]}
          onPress={() => setShowMap((v) => !v)}
        >
          <Text style={s.mapBtnText}>
            🗺️ {showMap ? 'Masquer la carte' : 'Afficher l\'itinéraire'}
          </Text>
        </TouchableOpacity>

        {/* Carte */}
        {showMap && (
          <View style={s.mapWrapper}>
            {/* GPS info */}
            <View style={s.gpsBar}>
              <Text style={[s.gpsText, { color: livreurPos ? '#16A34A' : '#DC2626' }]}>
                {gpsStatus}
              </Text>
              {distKm && (
                <Text style={s.gpsText}>Distance : ~{distKm} km</Text>
              )}
            </View>
            <MapView
              ref={mapRef}
              style={{ height: 300 }}
              provider={PROVIDER_GOOGLE}
              initialRegion={initialRegion}
            >
              {livreurPos && (
                <Marker coordinate={livreurPos} title="Votre position" pinColor="#3B82F6" />
              )}
              {clientPos && (
                <Marker coordinate={clientPos} title="Livraison" pinColor="#EF4444" />
              )}
              {route2.length > 1 && (
                <Polyline coordinates={route2} strokeColor="#3B82F6" strokeWidth={4} />
              )}
            </MapView>
          </View>
        )}

        {/* Articles */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>📦 Articles</Text>
          {order.items?.map((item) => (
            <View key={item.id} style={s.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.itemName}>{item.product?.name}</Text>
                <Text style={s.itemCat}>{item.product?.category?.name}</Text>
              </View>
              <Text style={s.itemQty}>×{item.quantity}</Text>
              <Text style={s.itemPrice}>{item.subtotal?.toFixed(2)} €</Text>
            </View>
          ))}
          <View style={s.totalRow}>
            <Text style={{ fontWeight: '600', fontSize: 14 }}>Total</Text>
            <Text style={{ fontWeight: '800', fontSize: 15, color: '#111827' }}>
              {parseFloat(order.total_price ?? 0).toFixed(2)} €
            </Text>
          </View>
        </View>

        {/* Action : Démarrer */}
        {order.status === 'validée' && (
          <View style={s.card}>
            <Text style={s.sectionTitle}>🚀 Action</Text>
            <Text style={s.actionHint}>Récupérez le colis et démarrez la livraison.</Text>
            <TouchableOpacity style={s.startBtn} onPress={handleStart} disabled={actionLoading}>
              {actionLoading
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.startBtnText}>▶ Démarrer la livraison</Text>
              }
            </TouchableOpacity>
          </View>
        )}

        {/* Action : Confirmer livraison OTP */}
        {order.status === 'en_cours' && (
          <View style={s.card}>
            <Text style={s.sectionTitle}>✅ Confirmer la livraison</Text>
            <Text style={s.actionHint}>Demandez le code OTP au client.</Text>
            <TextInput
              style={s.otpInput}
              value={otpInput}
              onChangeText={(v) => setOtpInput(v.replace(/\D/g, '').slice(0, 6))}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="_ _ _ _ _ _"
              placeholderTextColor="#9CA3AF"
            />
            {otpError && <Text style={s.error}>{otpError}</Text>}
            <TouchableOpacity
              style={[s.deliverBtn, otpInput.length < 6 && { opacity: 0.5 }]}
              onPress={handleDeliver}
              disabled={otpLoading || otpInput.length < 6}
            >
              {otpLoading
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.deliverBtnText}>✓ Confirmer la livraison</Text>
              }
            </TouchableOpacity>
          </View>
        )}

        {/* Historique */}
        {order.status_history?.length > 0 && (
          <View style={s.card}>
            <Text style={s.sectionTitle}>🕒 Historique</Text>
            {order.status_history.map((h) => (
              <View key={h.id} style={s.historyRow}>
                <Text style={s.historyStatus}>{STATUS_LABEL[h.new_status] ?? h.new_status}</Text>
                <Text style={s.historyBy}> par {h.changed_by?.name}</Text>
                <Text style={s.historyDate}>
                  {new Date(h.created_at).toLocaleString('fr-FR')}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#F9FAFB' },
  scroll:      { padding: 12, paddingBottom: 40 },

  statusRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  titleText:   { fontSize: 18, fontWeight: '700', color: '#111827' },
  statusBadge: { borderRadius: 99, paddingHorizontal: 12, paddingVertical: 4 },
  statusText:  { fontSize: 12, fontWeight: '600' },

  card:         { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 10 },

  infoRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label:      { fontSize: 13, color: '#6B7280' },
  value:      { fontSize: 14, fontWeight: '600', color: '#111827' },
  phone:      { fontSize: 14, fontWeight: '600', color: '#3B82F6' },
  divider:    { borderTopWidth: 1, borderTopColor: '#F3F4F6', marginVertical: 10 },

  addrRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 4 },
  dot:        { width: 12, height: 12, borderRadius: 6, marginTop: 3 },
  connector:  { width: 2, height: 12, backgroundColor: '#D1D5DB', marginLeft: 5 },
  addrLabel:  { fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase' },
  addrValue:  { fontSize: 14, color: '#111827', fontWeight: '500' },
  notesBox:   { backgroundColor: '#F9FAFB', borderRadius: 8, padding: 10, marginTop: 8 },
  notes:      { fontSize: 13, color: '#374151' },

  mapBtn:      { borderRadius: 10, padding: 13, alignItems: 'center', marginBottom: 12 },
  mapBtnText:  { color: '#fff', fontWeight: '700', fontSize: 14 },
  mapWrapper:  { borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  gpsBar:      { flexDirection: 'row', justifyContent: 'space-between', padding: 8, backgroundColor: '#F9FAFB' },
  gpsText:     { fontSize: 12 },

  itemRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', gap: 8 },
  itemName:   { fontSize: 14, fontWeight: '600', color: '#111827' },
  itemCat:    { fontSize: 11, color: '#9CA3AF' },
  itemQty:    { fontSize: 13, color: '#6B7280' },
  itemPrice:  { fontSize: 14, fontWeight: '700', color: '#111827', minWidth: 54, textAlign: 'right' },
  totalRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 },

  actionHint: { fontSize: 13, color: '#6B7280', marginBottom: 10 },
  startBtn:   { backgroundColor: '#3B82F6', borderRadius: 10, padding: 14, alignItems: 'center' },
  startBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  otpInput:   { borderWidth: 2, borderColor: '#D1D5DB', borderRadius: 10, padding: 12, fontSize: 28, letterSpacing: 14, textAlign: 'center', color: '#111827', marginBottom: 10 },
  deliverBtn: { backgroundColor: '#16A34A', borderRadius: 10, padding: 14, alignItems: 'center' },
  deliverBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  error:      { color: '#DC2626', fontSize: 13, textAlign: 'center', marginBottom: 8 },

  historyRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 4, paddingVertical: 4 },
  historyStatus: { fontWeight: '700', color: '#1D4ED8', fontSize: 12 },
  historyBy:     { color: '#6B7280', fontSize: 12 },
  historyDate:   { color: '#9CA3AF', fontSize: 11, marginLeft: 'auto' },
})
