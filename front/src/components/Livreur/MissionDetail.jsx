import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import DeliveryMap from './DeliveryMap'

const STATUS_LABEL = {
  en_attente: 'En attente',
  validée:    'Validée',
  en_cours:   'En livraison',
  livré:      'Livré',
  annulée:    'Annulée',
}

export default function MissionDetail() {
  const { id }  = useParams()
  const navigate = useNavigate()

  const [order, setOrder]       = useState(null)
  const [loading, setLoading]   = useState(true)
  const [showMap, setShowMap]   = useState(false)

  // État pour la confirmation OTP
  const [otpInput, setOtpInput]   = useState('')
  const [otpError, setOtpError]   = useState(null)
  const [otpLoading, setOtpLoading] = useState(false)

  // État pour démarrer la livraison
  const [startLoading, setStartLoading] = useState(false)

  const load = () => {
    setLoading(true)
    api.get(`/livreur/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => navigate('/livreur'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  // ── Actions ──────────────────────────────────────────────────────────────────

  const handleStart = async () => {
    if (!confirm('Démarrer cette livraison ?')) return
    setStartLoading(true)
    try {
      await api.put(`/livreur/orders/${id}/start`)
      load()
    } catch (err) {
      alert(err.response?.data?.message ?? 'Erreur.')
    } finally {
      setStartLoading(false)
    }
  }

  const handleDeliver = async (e) => {
    e.preventDefault()
    setOtpError(null)
    setOtpLoading(true)
    try {
      await api.put(`/livreur/orders/${id}/deliver`, { otp_code: otpInput })
      navigate('/livreur')
    } catch (err) {
      setOtpError(err.response?.data?.message ?? 'Code OTP incorrect.')
    } finally {
      setOtpLoading(false)
    }
  }

  // ── Rendu ─────────────────────────────────────────────────────────────────────

  if (loading) return <p style={s.loading}>Chargement...</p>
  if (!order)  return null

  const client = order.client

  return (
    <div style={s.page}>
      {/* ── En-tête ── */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate('/livreur')}>← Retour</button>
        <h2 style={s.title}>Commande #{order.id}</h2>
        <span style={{
          ...s.statusBadge,
          background: order.status === 'en_cours' ? '#DBEAFE' : '#FEF3C7',
          color:      order.status === 'en_cours' ? '#1D4ED8' : '#B45309',
        }}>
          {STATUS_LABEL[order.status] ?? order.status}
        </span>
      </div>

      {/* ── Infos client ── */}
      <section style={s.card}>
        <h3 style={s.sectionTitle}>📍 Client &amp; Livraison</h3>

        <div style={s.infoRow}>
          <span style={s.label}>Nom</span>
          <span style={s.value}>{client?.name}</span>
        </div>

        <div style={s.infoRow}>
          <span style={s.label}>Téléphone</span>
          <a href={`tel:${client?.phone}`} style={s.phone}>
            📞 {client?.phone ?? 'Non renseigné'}
          </a>
        </div>

        <div style={s.divider} />

        <div style={s.addressBlock}>
          <div style={s.addressItem}>
            <span style={{ ...s.dot, background: '#22C55E' }} />
            <div>
              <div style={s.addressLabel}>Adresse d'enlèvement</div>
              <div style={s.addressValue}>{order.pickup_address}</div>
            </div>
          </div>
          <div style={s.addressConnector} />
          <div style={s.addressItem}>
            <span style={{ ...s.dot, background: '#EF4444' }} />
            <div>
              <div style={s.addressLabel}>Adresse de livraison</div>
              <div style={s.addressValue}>{order.delivery_address}</div>
            </div>
          </div>
        </div>

        {order.notes && (
          <div style={s.notes}>
            <span style={s.label}>Notes client :</span> {order.notes}
          </div>
        )}
      </section>

      {/* ── Bouton Afficher carte ── */}
      <button
        style={{ ...s.mapBtn, background: showMap ? '#6B7280' : '#3B82F6' }}
        onClick={() => setShowMap((v) => !v)}
      >
        🗺️ {showMap ? 'Masquer la carte' : 'Afficher l\'itinéraire'}
      </button>

      {/* ── Carte avec itinéraire ── */}
      {showMap && (
        <div style={s.mapWrapper}>
          <DeliveryMap
            orderId={order.id}
            deliveryAddress={order.delivery_address}
            deliveryLat={order.delivery_lat}
            deliveryLng={order.delivery_lng}
          />
        </div>
      )}

      {/* ── Détail commande ── */}
      <section style={s.card}>
        <h3 style={s.sectionTitle}>📦 Articles commandés</h3>

        <div style={s.itemsList}>
          {order.items?.map((item) => (
            <div key={item.id} style={s.itemRow}>
              <div style={s.itemInfo}>
                <span style={s.itemName}>{item.product?.name}</span>
                <span style={s.itemCategory}>{item.product?.category?.name}</span>
              </div>
              <div style={s.itemRight}>
                <span style={s.itemQty}>×{item.quantity}</span>
                <span style={s.itemPrice}>{item.subtotal?.toFixed(2)} €</span>
              </div>
            </div>
          ))}
        </div>

        <div style={s.totalRow}>
          <span>Total</span>
          <strong>{order.total_price?.toFixed(2)} €</strong>
        </div>
      </section>

      {/* ── Actions selon statut ── */}
      {order.status === 'validée' && (
        <section style={s.card}>
          <h3 style={s.sectionTitle}>🚀 Action</h3>
          <p style={s.actionHint}>Récupérez le colis et démarrez la livraison.</p>
          <button style={s.startBtn} onClick={handleStart} disabled={startLoading}>
            {startLoading ? 'Démarrage...' : '▶ Démarrer la livraison'}
          </button>
        </section>
      )}

      {order.status === 'en_cours' && (
        <section style={s.card}>
          <h3 style={s.sectionTitle}>✅ Confirmer la livraison</h3>
          <p style={s.actionHint}>
            Demandez le code OTP au client pour confirmer la réception.
          </p>
          <form onSubmit={handleDeliver} style={s.otpForm}>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              placeholder="_ _ _ _ _ _"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/, ''))}
              style={s.otpInput}
              required
            />
            {otpError && <p style={s.error}>{otpError}</p>}
            <button type="submit" style={s.deliverBtn} disabled={otpLoading || otpInput.length < 6}>
              {otpLoading ? 'Vérification...' : '✓ Confirmer la livraison'}
            </button>
          </form>
        </section>
      )}

      {/* ── Historique des statuts ── */}
      {order.status_history?.length > 0 && (
        <section style={s.card}>
          <h3 style={s.sectionTitle}>🕒 Historique</h3>
          {order.status_history.map((h) => (
            <div key={h.id} style={s.historyRow}>
              <span style={s.historyStatus}>{STATUS_LABEL[h.new_status] ?? h.new_status}</span>
              <span style={s.historyBy}>par {h.changed_by?.name}</span>
              <span style={s.historyDate}>
                {new Date(h.created_at).toLocaleString('fr-FR')}
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

const s = {
  page:    { maxWidth: 640, margin: '0 auto', padding: '16px', fontFamily: 'system-ui, sans-serif' },
  loading: { textAlign: 'center', padding: 40, color: '#6B7280' },

  header:      { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' },
  backBtn:     { background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: 14 },
  title:       { flex: 1, fontSize: 20, fontWeight: 700, margin: 0 },
  statusBadge: { fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 99 },

  card:         { background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: 700, margin: '0 0 12px', color: '#111827' },

  infoRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label:    { color: '#6B7280', fontSize: 13 },
  value:    { fontWeight: 600, fontSize: 14, color: '#111827' },
  phone:    { fontWeight: 600, fontSize: 14, color: '#3B82F6', textDecoration: 'none' },
  divider:  { borderTop: '1px solid #F3F4F6', margin: '12px 0' },

  addressBlock:    { display: 'flex', flexDirection: 'column', gap: 4 },
  addressItem:     { display: 'flex', alignItems: 'flex-start', gap: 10 },
  dot:             { width: 12, height: 12, borderRadius: '50%', flexShrink: 0, marginTop: 3 },
  addressConnector: { width: 2, height: 16, background: '#D1D5DB', marginLeft: 5 },
  addressLabel:    { fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 },
  addressValue:    { fontSize: 14, color: '#111827', fontWeight: 500 },
  notes:           { marginTop: 12, fontSize: 13, color: '#374151', background: '#F9FAFB', padding: 10, borderRadius: 8 },

  mapBtn:     {
    display: 'block', width: '100%', padding: '12px',
    color: '#fff', fontWeight: 700, fontSize: 15,
    border: 'none', borderRadius: 10, cursor: 'pointer',
    marginBottom: 12, transition: 'background 0.2s',
  },
  mapWrapper: { marginBottom: 12, borderRadius: 12, overflow: 'hidden', border: '1px solid #E5E7EB' },

  itemsList: { display: 'flex', flexDirection: 'column', gap: 8 },
  itemRow:   {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 0', borderBottom: '1px solid #F3F4F6',
  },
  itemInfo:     { display: 'flex', flexDirection: 'column', gap: 2 },
  itemName:     { fontSize: 14, fontWeight: 600, color: '#111827' },
  itemCategory: { fontSize: 11, color: '#9CA3AF' },
  itemRight:    { display: 'flex', alignItems: 'center', gap: 12 },
  itemQty:      { fontSize: 13, color: '#6B7280' },
  itemPrice:    { fontSize: 14, fontWeight: 700, color: '#111827' },
  totalRow:     { display: 'flex', justifyContent: 'space-between', paddingTop: 10, fontSize: 15 },

  actionHint: { fontSize: 13, color: '#6B7280', marginBottom: 12 },
  startBtn:   {
    width: '100%', padding: 14, background: '#3B82F6', color: '#fff',
    border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer',
  },
  otpForm:    { display: 'flex', flexDirection: 'column', gap: 10 },
  otpInput:   {
    fontSize: 28, letterSpacing: 12, textAlign: 'center',
    border: '2px solid #D1D5DB', borderRadius: 10, padding: '10px 16px',
    outline: 'none',
  },
  deliverBtn: {
    padding: 14, background: '#16A34A', color: '#fff',
    border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer',
  },
  error:      { color: '#DC2626', fontSize: 13, textAlign: 'center' },

  historyRow:    { display: 'flex', gap: 8, fontSize: 12, padding: '4px 0', flexWrap: 'wrap' },
  historyStatus: { fontWeight: 700, color: '#1D4ED8' },
  historyBy:     { color: '#6B7280' },
  historyDate:   { color: '#9CA3AF', marginLeft: 'auto' },
}
