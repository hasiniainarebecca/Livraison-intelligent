import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const STATUS_CONFIG = {
  validée:  { label: 'À récupérer', color: '#F97316', bg: '#FFF7ED' },
  en_cours: { label: 'En livraison', color: '#3B82F6', bg: '#EFF6FF' },
}

export default function MissionList() {
  const navigate = useNavigate()
  const [missions, setMissions] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/livreur/orders')
      .then(({ data }) => setMissions(data.data ?? data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={styles.loading}>Chargement des missions...</p>

  if (missions.length === 0) {
    return (
      <div style={styles.empty}>
        <span style={styles.emptyIcon}>📦</span>
        <p>Aucune mission assignée pour le moment.</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mes missions ({missions.length})</h2>

      <div style={styles.list}>
        {missions.map((mission) => {
          const st = STATUS_CONFIG[mission.status] ?? { label: mission.status, color: '#6B7280', bg: '#F3F4F6' }
          const itemCount = mission.items?.length ?? 0

          return (
            <div
              key={mission.id}
              style={styles.card}
              onClick={() => navigate(`/livreur/missions/${mission.id}`)}
            >
              {/* En-tête carte */}
              <div style={styles.cardHeader}>
                <span style={styles.orderId}>Commande #{mission.id}</span>
                <span style={{ ...styles.badge, color: st.color, background: st.bg }}>
                  {st.label}
                </span>
              </div>

              {/* Type */}
              <div style={styles.typeRow}>
                <span style={{
                  ...styles.typeBadge,
                  background: mission.type === 'express' ? '#FEF3C7' : '#F0FDF4',
                  color: mission.type === 'express' ? '#D97706' : '#16A34A',
                }}>
                  {mission.type === 'express' ? '⚡ Express' : '📮 Standard'}
                </span>
                <span style={styles.price}>{mission.total_price?.toFixed(2)} €</span>
              </div>

              {/* Adresses */}
              <div style={styles.addresses}>
                <div style={styles.addressRow}>
                  <span style={{ ...styles.addressDot, background: '#22C55E' }} />
                  <span style={styles.addressText} title={mission.pickup_address}>
                    {mission.pickup_address}
                  </span>
                </div>
                <div style={styles.addressLine} />
                <div style={styles.addressRow}>
                  <span style={{ ...styles.addressDot, background: '#EF4444' }} />
                  <span style={styles.addressText} title={mission.delivery_address}>
                    {mission.delivery_address}
                  </span>
                </div>
              </div>

              {/* Pied de carte */}
              <div style={styles.cardFooter}>
                <span style={styles.clientName}>
                  👤 {mission.client?.name ?? '—'}
                </span>
                <span style={styles.itemCount}>
                  {itemCount} article{itemCount > 1 ? 's' : ''}
                </span>
                <span style={styles.chevron}>›</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: 600, margin: '0 auto', padding: '16px' },
  title:     { fontSize: 20, fontWeight: 700, marginBottom: 16 },
  loading:   { textAlign: 'center', padding: 40, color: '#6B7280' },
  empty:     { textAlign: 'center', padding: 60, color: '#9CA3AF' },
  emptyIcon: { fontSize: 48, display: 'block', marginBottom: 12 },
  list:      { display: 'flex', flexDirection: 'column', gap: 12 },

  card: {
    background: '#fff',
    borderRadius: 12,
    border: '1px solid #E5E7EB',
    padding: 16,
    cursor: 'pointer',
    transition: 'box-shadow 0.15s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 8,
  },
  orderId:   { fontWeight: 700, fontSize: 15, color: '#111827' },
  badge:     { fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 99 },
  typeRow:   { display: 'flex', justifyContent: 'space-between', marginBottom: 12 },
  typeBadge: { fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 6 },
  price:     { fontWeight: 700, color: '#111827' },

  addresses:   { marginBottom: 12 },
  addressRow:  { display: 'flex', alignItems: 'flex-start', gap: 8, padding: '4px 0' },
  addressDot:  { width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: 4 },
  addressText: {
    fontSize: 13, color: '#374151', whiteSpace: 'nowrap',
    overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90%',
  },
  addressLine: {
    width: 2, height: 12, background: '#D1D5DB',
    marginLeft: 4, marginTop: -2, marginBottom: -2,
  },

  cardFooter:  { display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid #F3F4F6', paddingTop: 10 },
  clientName:  { fontSize: 13, color: '#6B7280', flex: 1 },
  itemCount:   { fontSize: 12, color: '#9CA3AF' },
  chevron:     { fontSize: 20, color: '#9CA3AF', lineHeight: 1 },
}
