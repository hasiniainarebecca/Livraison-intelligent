import { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import api from '../../api/axios'

// Configure Laravel Echo avec Pusher
const echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.EXPO_PUBLIC_PUSHER_KEY ?? '',
  cluster: process.env.EXPO_PUBLIC_PUSHER_CLUSTER ?? 'mt1',
  forceTLS: true,
  disableStats: true,
  Pusher,
})

const STATUS_LABEL = {
  'en_attente': 'En attente',
  'validée':    'Validée',
  'en_cours':   'En cours de livraison',
  'livrée':     'Livrée ✓',
  'annulée':    'Annulée',
}

export default function TrackOrderScreen({ route }) {
  const { orderId } = route.params
  const [order, setOrder]       = useState(null)
  const [livreurPos, setLivreurPos] = useState(null)
  const [loading, setLoading]   = useState(true)
  const mapRef = useRef(null)

  useEffect(() => {
    api.get(`/client/orders/${orderId}`)
      .then(({ data }) => {
        setOrder(data)
        if (data.last_location) {
          setLivreurPos({
            latitude: parseFloat(data.last_location.latitude),
            longitude: parseFloat(data.last_location.longitude),
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    // Écouter les mises à jour GPS en temps réel
    const channel = echo.channel(`delivery.${orderId}`)
    channel.listen('.location.updated', (data) => {
      const pos = { latitude: parseFloat(data.latitude), longitude: parseFloat(data.longitude) }
      setLivreurPos(pos)
      mapRef.current?.animateToRegion({ ...pos, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 500)
    })

    return () => echo.leaveChannel(`delivery.${orderId}`)
  }, [orderId])

  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 60 }} />
      </SafeAreaView>
    )
  }

  if (!order) {
    return (
      <SafeAreaView style={s.container}>
        <Text style={s.errorText}>Commande introuvable.</Text>
      </SafeAreaView>
    )
  }

  const deliveryCoord = order.delivery_lat && order.delivery_lng
    ? { latitude: parseFloat(order.delivery_lat), longitude: parseFloat(order.delivery_lng) }
    : null

  const initialRegion = livreurPos
    ? { ...livreurPos, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : { latitude: -18.9137, longitude: 47.5361, latitudeDelta: 0.1, longitudeDelta: 0.1 }

  return (
    <SafeAreaView style={s.container}>
      {/* Info commande */}
      <View style={s.info}>
        <Text style={s.infoTitle}>Commande #{order.id}</Text>
        <Text style={s.infoStatus}>{STATUS_LABEL[order.status] ?? order.status}</Text>
        <View style={s.infoRow}>
          <View style={[s.dot, { backgroundColor: '#10B981' }]} />
          <Text style={s.infoAddr} numberOfLines={1}>{order.pickup_address}</Text>
        </View>
        <View style={s.infoRow}>
          <View style={[s.dot, { backgroundColor: '#EF4444' }]} />
          <Text style={s.infoAddr} numberOfLines={1}>{order.delivery_address}</Text>
        </View>
      </View>

      {/* Carte */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation={false}
      >
        {livreurPos && (
          <Marker coordinate={livreurPos} title="Livreur" pinColor="#3B82F6" />
        )}
        {deliveryCoord && (
          <Marker coordinate={deliveryCoord} title="Livraison" pinColor="#EF4444" />
        )}
        {livreurPos && deliveryCoord && (
          <Polyline
            coordinates={[livreurPos, deliveryCoord]}
            strokeColor="#3B82F6"
            strokeWidth={3}
          />
        )}
      </MapView>

      {/* Message si pas de position */}
      {!livreurPos && (
        <View style={s.waiting}>
          <Text style={s.waitingText}>En attente de la position du livreur...</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#fff' },
  info:        { padding: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  infoTitle:   { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  infoStatus:  { fontSize: 13, color: '#3B82F6', fontWeight: '600', marginBottom: 8 },
  infoRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  dot:         { width: 8, height: 8, borderRadius: 4 },
  infoAddr:    { fontSize: 12, color: '#6B7280', flex: 1 },
  errorText:   { textAlign: 'center', marginTop: 60, color: '#9CA3AF', fontSize: 15 },
  waiting:     { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 10, padding: 12, alignItems: 'center' },
  waitingText: { color: '#fff', fontSize: 13 },
})
