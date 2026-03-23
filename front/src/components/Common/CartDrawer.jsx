import { useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, changeQty, totalItems, totalPrice } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    onClose()
    if (!user) {
      navigate('/login?redirect=/client/orders/new')
    } else {
      navigate('/client/orders/new')
    }
  }

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div style={s.overlay} onClick={onClose} />

      {/* Drawer */}
      <div style={s.drawer}>
        <div style={s.header}>
          <span style={s.title}>🛒 Mon panier ({totalItems})</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={s.body}>
          {cart.length === 0 ? (
            <div style={s.empty}>
              <p style={{ fontSize: 40 }}>🛒</p>
              <p style={{ color: '#9CA3AF' }}>Votre panier est vide</p>
            </div>
          ) : (
            cart.map(({ product, quantity }) => (
              <div key={product.id} style={s.item}>
                <div style={s.itemInfo}>
                  <span style={s.itemName}>{product.name}</span>
                  <span style={s.itemPrice}>{(product.price * quantity).toFixed(2)} €</span>
                </div>
                <div style={s.itemControls}>
                  <button style={s.qtyBtn} onClick={() => changeQty(product.id, quantity - 1)}>−</button>
                  <span style={s.qty}>{quantity}</span>
                  <button style={s.qtyBtn} onClick={() => changeQty(product.id, quantity + 1)}>+</button>
                  <button style={s.removeBtn} onClick={() => removeFromCart(product.id)}>🗑</button>
                </div>
                <span style={s.unitPrice}>{product.price.toFixed(2)} € / unité</span>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={s.footer}>
            <div style={s.total}>
              <span>Total</span>
              <span style={{ fontWeight: 700, fontSize: 18 }}>{totalPrice.toFixed(2)} €</span>
            </div>
            <button style={s.checkoutBtn} onClick={handleCheckout}>
              {user ? 'Passer la commande →' : 'Se connecter pour commander →'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

const s = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    zIndex: 200,
  },
  drawer: {
    position: 'fixed', top: 0, right: 0, bottom: 0,
    width: 380, maxWidth: '100vw',
    background: '#fff', boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
    zIndex: 201, display: 'flex', flexDirection: 'column',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderBottom: '1px solid #E5E7EB',
  },
  title:    { fontWeight: 700, fontSize: 16 },
  closeBtn: { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#6B7280' },

  body:  { flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  empty: { textAlign: 'center', padding: '40px 0' },

  item: {
    background: '#F9FAFB', borderRadius: 10, padding: 12,
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  itemInfo:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemName:     { fontWeight: 600, fontSize: 14, flex: 1, marginRight: 8 },
  itemPrice:    { fontWeight: 700, fontSize: 14, color: '#3B82F6', whiteSpace: 'nowrap' },
  itemControls: { display: 'flex', alignItems: 'center', gap: 8 },
  qtyBtn:       { width: 28, height: 28, borderRadius: 6, border: '1px solid #D1D5DB', background: '#fff', cursor: 'pointer', fontWeight: 700 },
  qty:          { minWidth: 24, textAlign: 'center', fontWeight: 700 },
  removeBtn:    { background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, marginLeft: 'auto', color: '#EF4444' },
  unitPrice:    { fontSize: 11, color: '#9CA3AF' },

  footer: {
    borderTop: '1px solid #E5E7EB', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12,
  },
  total: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 15 },
  checkoutBtn: {
    background: '#10B981', color: '#fff', border: 'none', borderRadius: 10,
    padding: '12px 0', fontWeight: 700, fontSize: 15, cursor: 'pointer',
    width: '100%',
  },
}
