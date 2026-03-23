import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'

export default function CartScreen() {
  const navigation = useNavigation()
  const { user } = useAuth()
  const { cart, removeFromCart, changeQty, totalItems, totalPrice } = useCart()

  const handleCheckout = () => {
    if (!user || user.role !== 'client') {
      navigation.navigate('Login')
      return
    }
    navigation.navigate('Checkout')
  }

  if (cart.length === 0) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.empty}>
          <Text style={{ fontSize: 56 }}>🛒</Text>
          <Text style={s.emptyText}>Votre panier est vide.</Text>
          <TouchableOpacity style={s.shopBtn} onPress={() => navigation.navigate('CatalogTab')}>
            <Text style={s.shopBtnText}>Parcourir le catalogue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const renderItem = ({ item }) => (
    <View style={s.item}>
      <View style={s.itemIcon}>
        <Text style={{ fontSize: 26 }}>{item.product.category?.icon ?? '📦'}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.itemName} numberOfLines={2}>{item.product.name}</Text>
        <Text style={s.itemUnit}>{parseFloat(item.product.price).toFixed(2)} € / unité</Text>
      </View>
      <View style={s.qtyRow}>
        <TouchableOpacity style={s.qBtn} onPress={() => changeQty(item.product.id, item.quantity - 1)}>
          <Text style={s.qBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={s.qty}>{item.quantity}</Text>
        <TouchableOpacity style={s.qBtn} onPress={() => changeQty(item.product.id, item.quantity + 1)}>
          <Text style={s.qBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={s.itemTotal}>{(item.product.price * item.quantity).toFixed(2)} €</Text>
      <TouchableOpacity onPress={() => removeFromCart(item.product.id)} style={s.removeBtn}>
        <Text style={s.removeBtnText}>✕</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={s.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => String(item.product.id)}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        ListFooterComponent={
          <View style={s.footer}>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Total ({totalItems} article{totalItems > 1 ? 's' : ''})</Text>
              <Text style={s.totalPrice}>{totalPrice.toFixed(2)} €</Text>
            </View>
            <TouchableOpacity style={s.checkoutBtn} onPress={handleCheckout}>
              <Text style={s.checkoutBtnText}>Commander →</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#F9FAFB' },
  empty:          { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText:      { fontSize: 16, color: '#6B7280', marginTop: 12 },
  shopBtn:        { marginTop: 20, backgroundColor: '#3B82F6', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 },
  shopBtnText:    { color: '#fff', fontWeight: '700', fontSize: 15 },

  list:           { padding: 12, paddingBottom: 20 },

  item:           { backgroundColor: '#fff', borderRadius: 12, flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1, gap: 8 },
  itemIcon:       { width: 44, height: 44, backgroundColor: '#F3F4F6', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  itemName:       { fontSize: 14, fontWeight: '600', color: '#111827', flex: 1 },
  itemUnit:       { fontSize: 12, color: '#9CA3AF', marginTop: 2 },

  qtyRow:         { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qBtn:           { width: 28, height: 28, borderRadius: 7, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  qBtnText:       { fontSize: 16, fontWeight: '700', color: '#374151' },
  qty:            { fontSize: 15, fontWeight: '700', minWidth: 20, textAlign: 'center', color: '#111827' },

  itemTotal:      { fontSize: 14, fontWeight: '700', color: '#111827', minWidth: 54, textAlign: 'right' },
  removeBtn:      { padding: 4 },
  removeBtnText:  { fontSize: 14, color: '#9CA3AF' },

  footer:         { marginTop: 8 },
  totalRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 12, marginBottom: 12 },
  totalLabel:     { fontSize: 15, color: '#374151', fontWeight: '600' },
  totalPrice:     { fontSize: 20, fontWeight: '800', color: '#111827' },
  checkoutBtn:    { backgroundColor: '#3B82F6', borderRadius: 12, padding: 16, alignItems: 'center' },
  checkoutBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})
