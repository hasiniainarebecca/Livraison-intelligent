import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const STATUS_COLOR = {
  'en_attente':  { bg: '#FEF3C7', color: '#92400E', label: 'En attente' },
  'validée':     { bg: '#DBEAFE', color: '#1E40AF', label: 'Validée' },
  'en_cours':    { bg: '#D1FAE5', color: '#065F46', label: 'En cours' },
  'livrée':      { bg: '#DCFCE7', color: '#166534', label: 'Livrée ✓' },
  'annulée':     { bg: '#FEE2E2', color: '#991B1B', label: 'Annulée' },
}

export default function OrderList() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/client/orders')
      .then(({ data }) => setOrders(data.data ?? data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>Chargement...</p>

  if (!orders.length) {
    return (
      <div style={s.empty}>
        <p style={{ fontSize: 48 }}>📦</p>
        <p style={{ color: '#6B7280', fontSize: 16 }}>Vous n'avez pas encore de commandes.</p>
        <button style={s.newBtn} onClick={() => navigate('/client/orders/new')}>
          Passer une commande
        </button>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>Mes commandes</h2>
        <button style={s.newBtn} onClick={() => navigate('/client/orders/new')}>
          + Nouvelle commande
        </button>
      </div>

      <div style={s.list}>
        {orders.map((order) => {
          const st = STATUS_COLOR[order.status] ?? { bg: '#F3F4F6', color: '#6B7280', label: order.status }
          const canTrack = ['validée', 'en_cours'].includes(order.status)
          const canCancel = order.status === 'en_attente'
          const itemCount = order.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0

          return (
            <div key={order.id} style={s.card}>
              <div style={s.cardTop}>
                <div>
                  <span style={s.orderId}>Commande #{order.id}</span>
                  <span style={{ ...s.badge, background: st.bg, color: st.color }}>{st.label}</span>
                </div>
                <span style={s.date}>
                  {new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>

              {/* Articles */}
              {order.items?.length > 0 && (
                <div style={s.items}>
                  {order.items.slice(0, 3).map((item, i) => (
                    <span key={i} style={s.itemChip}>
                      {item.product?.name ?? `Produit #${item.product_id}`} ×{item.quantity}
                    </span>
                  ))}
                  {order.items.length > 3 && (
                    <span style={{ ...s.itemChip, background: '#F3F4F6', color: '#6B7280' }}>
                      +{order.items.length - 3} autre{order.items.length - 3 > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}

              <div style={s.cardBottom}>
                {/* Adresses */}
                <div style={s.addresses}>
                  <div style={s.addr}>
                    <span style={{ ...s.dot, background: '#10B981' }} />
                    <span style={s.addrText}>{order.pickup_address}</span>
                  </div>
                  <div style={s.addr}>
                    <span style={{ ...s.dot, background: '#EF4444' }} />
                    <span style={s.addrText}>{order.delivery_address}</span>
                  </div>
                </div>

                {/* Prix + actions */}
                <div style={s.actions}>
                  {order.total_price > 0 && (
                    <span style={s.price}>{parseFloat(order.total_price).toFixed(2)} €</span>
                  )}
                  {canTrack && (
                    <button style={s.trackBtn} onClick={() => navigate(`/client/orders/${order.id}/track`)}>
                      🗺 Suivre
                    </button>
                  )}
                  {canCancel && (
                    <CancelButton orderId={order.id} onCancelled={
                      () => setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'annulée' } : o))
                    } />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CancelButton({ orderId, onCancelled }) {
  const [loading, setLoading] = useState(false)

  const handleCancel = async () => {
    if (!confirm('Confirmer l\'annulation de cette commande ?')) return
    setLoading(true)
    try {
      await api.patch(`/client/orders/${orderId}/cancel`)
      onCancelled()
    } catch {
      alert('Impossible d\'annuler cette commande.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button style={s.cancelBtn} onClick={handleCancel} disabled={loading}>
      {loading ? '...' : 'Annuler'}
    </button>
  )
}

const s = {
  page:   { padding: 16, maxWidth: 720, margin: '0 auto', fontFamily: 'system-ui, sans-serif' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  title:  { fontSize: 22, fontWeight: 700, margin: 0 },
  newBtn: { background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 14 },

  empty: { textAlign: 'center', padding: 60 },

  list: { display: 'flex', flexDirection: 'column', gap: 12 },

  card: {
    background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB',
    padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  orderId: { fontWeight: 700, fontSize: 15, marginRight: 10 },
  badge:   { fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 600 },
  date:    { fontSize: 12, color: '#9CA3AF' },

  items: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  itemChip: {
    fontSize: 12, background: '#EFF6FF', color: '#1D4ED8',
    padding: '2px 8px', borderRadius: 99,
  },

  cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 8 },

  addresses: { display: 'flex', flexDirection: 'column', gap: 4 },
  addr:     { display: 'flex', alignItems: 'center', gap: 6 },
  dot:      { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  addrText: { fontSize: 12, color: '#6B7280', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },

  actions: { display: 'flex', alignItems: 'center', gap: 8 },
  price:   { fontWeight: 700, fontSize: 15, color: '#111827' },
  trackBtn: {
    background: '#10B981', color: '#fff', border: 'none',
    borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
  },
  cancelBtn: {
    background: 'none', color: '#DC2626', border: '1px solid #FECACA',
    borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 13,
  },
}
