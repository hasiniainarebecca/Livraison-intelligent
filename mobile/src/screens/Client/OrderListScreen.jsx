import { useEffect, useState, useCallback } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator, Alert, RefreshControl,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import api from '../../api/axios'

const STATUS = {
  'en_attente': { bg: '#FEF3C7', color: '#92400E', label: 'En attente' },
  'validée':    { bg: '#DBEAFE', color: '#1E40AF', label: 'Validée' },
  'en_cours':   { bg: '#D1FAE5', color: '#065F46', label: 'En cours' },
  'livrée':     { bg: '#DCFCE7', color: '#166534', label: 'Livrée ✓' },
  'annulée':    { bg: '#FEE2E2', color: '#991B1B', label: 'Annulée' },
}

export default function OrderListScreen() {
  const navigation = useNavigation()
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const { data } = await api.get('/client/orders')
      setOrders(data.data ?? data)
    } catch {}
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleCancel = (orderId) => {
    Alert.alert(
      'Annuler la commande',
      'Confirmer l\'annulation de cette commande ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.patch(`/client/orders/${orderId}/cancel`)
              setOrders((prev) =>
                prev.map((o) => o.id === orderId ? { ...o, status: 'annulée' } : o)
              )
            } catch {
              Alert.alert('Erreur', 'Impossible d\'annuler cette commande.')
            }
          },
        },
      ]
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 60 }} />
      </SafeAreaView>
    )
  }

  const renderItem = ({ item }) => {
    const st = STATUS[item.status] ?? { bg: '#F3F4F6', color: '#6B7280', label: item.status }
    const canTrack  = ['validée', 'en_cours'].includes(item.status)
    const canCancel = item.status === 'en_attente'

    return (
      <View style={s.card}>
        {/* En-tête */}
        <View style={s.cardTop}>
          <Text style={s.orderId}>Commande #{item.id}</Text>
          <View style={[s.badge, { backgroundColor: st.bg }]}>
            <Text style={[s.badgeText, { color: st.color }]}>{st.label}</Text>
          </View>
        </View>
        <Text style={s.date}>
          {new Date(item.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
        </Text>

        {/* Articles */}
        {item.items?.length > 0 && (
          <View style={s.chips}>
            {item.items.slice(0, 3).map((it, i) => (
              <View key={i} style={s.chip}>
                <Text style={s.chipText} numberOfLines={1}>
                  {it.product?.name ?? `Produit #${it.product_id}`} ×{it.quantity}
                </Text>
              </View>
            ))}
            {item.items.length > 3 && (
              <View style={[s.chip, { backgroundColor: '#F3F4F6' }]}>
                <Text style={[s.chipText, { color: '#6B7280' }]}>+{item.items.length - 3}</Text>
              </View>
            )}
          </View>
        )}

        {/* Adresses */}
        <View style={s.addresses}>
          <View style={s.addrRow}>
            <View style={[s.dot, { backgroundColor: '#10B981' }]} />
            <Text style={s.addrText} numberOfLines={1}>{item.pickup_address}</Text>
          </View>
          <View style={s.addrRow}>
            <View style={[s.dot, { backgroundColor: '#EF4444' }]} />
            <Text style={s.addrText} numberOfLines={1}>{item.delivery_address}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={s.actions}>
          {item.total_price > 0 && (
            <Text style={s.price}>{parseFloat(item.total_price).toFixed(2)} €</Text>
          )}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {canTrack && (
              <TouchableOpacity
                style={s.trackBtn}
                onPress={() => navigation.navigate('TrackOrder', { orderId: item.id })}
              >
                <Text style={s.trackBtnText}>🗺 Suivre</Text>
              </TouchableOpacity>
            )}
            {canCancel && (
              <TouchableOpacity style={s.cancelBtn} onPress={() => handleCancel(item.id)}>
                <Text style={s.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={s.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 48 }}>📦</Text>
            <Text style={s.emptyText}>Vous n'avez pas encore de commandes.</Text>
            <TouchableOpacity style={s.newBtn} onPress={() => navigation.navigate('CatalogTab')}>
              <Text style={s.newBtnText}>Parcourir le catalogue</Text>
            </TouchableOpacity>
          </View>
        }
        ListHeaderComponent={
          <View style={s.header}>
            <Text style={s.title}>Mes commandes</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  list:      { padding: 12, paddingBottom: 20 },

  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title:   { fontSize: 20, fontWeight: '700', color: '#111827' },

  empty:      { alignItems: 'center', paddingTop: 60 },
  emptyText:  { fontSize: 15, color: '#6B7280', marginTop: 10 },
  newBtn:     { marginTop: 18, backgroundColor: '#3B82F6', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 },
  newBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  card:    { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  orderId: { fontWeight: '700', fontSize: 15, color: '#111827' },
  badge:   { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  date:    { fontSize: 12, color: '#9CA3AF', marginBottom: 10 },

  chips:    { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  chip:     { backgroundColor: '#EFF6FF', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  chipText: { fontSize: 11, color: '#1D4ED8' },

  addresses: { marginBottom: 12 },
  addrRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  dot:       { width: 8, height: 8, borderRadius: 4 },
  addrText:  { fontSize: 12, color: '#6B7280', flex: 1 },

  actions:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price:      { fontSize: 16, fontWeight: '800', color: '#111827' },
  trackBtn:   { backgroundColor: '#10B981', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7 },
  trackBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  cancelBtn:  { borderWidth: 1, borderColor: '#FECACA', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  cancelBtnText: { color: '#DC2626', fontSize: 13 },
})
