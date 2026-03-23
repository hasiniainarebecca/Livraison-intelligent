import { useEffect, useState, useCallback } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator, RefreshControl,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import api from '../../api/axios'

const STATUS_CONFIG = {
  'validée':  { label: 'À récupérer', color: '#F97316', bg: '#FFF7ED' },
  'en_cours': { label: 'En livraison', color: '#3B82F6', bg: '#EFF6FF' },
}

export default function MissionListScreen() {
  const navigation = useNavigation()
  const [missions, setMissions]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const { data } = await api.get('/livreur/orders')
      setMissions(data.data ?? data)
    } catch {}
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 60 }} />
      </SafeAreaView>
    )
  }

  const renderItem = ({ item }) => {
    const st = STATUS_CONFIG[item.status] ?? { label: item.status, color: '#6B7280', bg: '#F3F4F6' }
    const itemCount = item.items?.length ?? 0

    return (
      <TouchableOpacity
        style={s.card}
        onPress={() => navigation.navigate('MissionDetail', { missionId: item.id })}
        activeOpacity={0.85}
      >
        {/* En-tête */}
        <View style={s.cardHeader}>
          <Text style={s.orderId}>Commande #{item.id}</Text>
          <View style={[s.badge, { backgroundColor: st.bg }]}>
            <Text style={[s.badgeText, { color: st.color }]}>{st.label}</Text>
          </View>
        </View>

        {/* Type + prix */}
        <View style={s.typeRow}>
          <View style={[s.typeTag, item.type === 'express'
            ? { backgroundColor: '#FEF3C7' }
            : { backgroundColor: '#F0FDF4' }
          ]}>
            <Text style={[s.typeTagText, { color: item.type === 'express' ? '#D97706' : '#16A34A' }]}>
              {item.type === 'express' ? '⚡ Express' : '📮 Standard'}
            </Text>
          </View>
          {item.total_price > 0 && (
            <Text style={s.price}>{parseFloat(item.total_price).toFixed(2)} €</Text>
          )}
        </View>

        {/* Adresses */}
        <View style={s.addresses}>
          <View style={s.addrRow}>
            <View style={[s.dot, { backgroundColor: '#22C55E' }]} />
            <Text style={s.addrText} numberOfLines={1}>{item.pickup_address}</Text>
          </View>
          <View style={s.connector} />
          <View style={s.addrRow}>
            <View style={[s.dot, { backgroundColor: '#EF4444' }]} />
            <Text style={s.addrText} numberOfLines={1}>{item.delivery_address}</Text>
          </View>
        </View>

        {/* Pied */}
        <View style={s.cardFooter}>
          <Text style={s.clientName}>👤 {item.client?.name ?? '—'}</Text>
          <Text style={s.itemCount}>{itemCount} article{itemCount > 1 ? 's' : ''}</Text>
          <Text style={s.chevron}>›</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={s.container}>
      <FlatList
        data={missions}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
        ListHeaderComponent={
          <Text style={s.title}>Mes missions ({missions.length})</Text>
        }
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 48 }}>📦</Text>
            <Text style={s.emptyText}>Aucune mission assignée pour le moment.</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  list:      { padding: 12, paddingBottom: 20 },
  title:     { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },

  empty:      { alignItems: 'center', paddingTop: 60 },
  emptyText:  { fontSize: 15, color: '#9CA3AF', marginTop: 10 },

  card:       { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderId:    { fontWeight: '700', fontSize: 15, color: '#111827' },
  badge:      { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText:  { fontSize: 12, fontWeight: '600' },

  typeRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  typeTag:    { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  typeTagText: { fontSize: 12, fontWeight: '600' },
  price:      { fontSize: 14, fontWeight: '700', color: '#111827' },

  addresses:  { marginBottom: 10 },
  addrRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 3 },
  dot:        { width: 10, height: 10, borderRadius: 5 },
  addrText:   { fontSize: 13, color: '#374151', flex: 1 },
  connector:  { width: 2, height: 10, backgroundColor: '#D1D5DB', marginLeft: 4 },

  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 10 },
  clientName: { fontSize: 13, color: '#6B7280', flex: 1 },
  itemCount:  { fontSize: 12, color: '#9CA3AF' },
  chevron:    { fontSize: 20, color: '#9CA3AF' },
})
