import { useEffect, useState } from 'react'
import api from '../../api/axios'

// ─── Sous-composant : panneau de mouvements d'un produit ─────────────────────
function StockDetail({ product, onClose }) {
  const [detail, setDetail]   = useState(null)
  const [form, setForm]       = useState({ quantity: '', note: '' })
  const [action, setAction]   = useState('add')   // 'add' | 'remove' | 'adjust'
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const load = () =>
    api.get(`/admin/stocks/${product.id}`)
      .then(({ data }) => setDetail(data))

  useEffect(() => { load() }, [product.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const endpoint = `/admin/stocks/${product.id}/${action}`
      const payload  = action === 'adjust'
        ? { new_quantity: parseInt(form.quantity), note: form.note }
        : { quantity: parseInt(form.quantity), note: form.note }
      await api.post(endpoint, payload)
      setForm({ quantity: '', note: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Erreur.')
    } finally {
      setLoading(false)
    }
  }

  const TYPE_COLOR = { entrée: '#16A34A', sortie: '#DC2626', retour: '#F97316', ajustement: '#6B7280' }

  if (!detail) return <p style={{ textAlign: 'center', padding: 20 }}>Chargement...</p>

  const currentQty = detail.stock?.quantity ?? 0
  const threshold  = detail.stock?.alert_threshold ?? 5
  const isLow      = currentQty <= threshold

  return (
    <div style={d.overlay}>
      <div style={d.panel}>
        <div style={d.panelHeader}>
          <div>
            <h3 style={d.panelTitle}>{product.name}</h3>
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>{product.category?.name}</span>
          </div>
          <button style={d.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Stock actuel */}
        <div style={{ ...d.stockBadge, background: isLow ? '#FEF2F2' : '#F0FDF4', border: `1px solid ${isLow ? '#FECACA' : '#BBF7D0'}` }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: isLow ? '#DC2626' : '#16A34A' }}>
            {currentQty}
          </span>
          <span style={{ fontSize: 13, color: '#6B7280' }}>
            unités disponibles {isLow && '⚠ Stock bas'}
          </span>
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>Seuil alerte : {threshold}</span>
        </div>

        {/* Formulaire mouvement */}
        <form onSubmit={handleSubmit} style={d.form}>
          <div style={d.tabRow}>
            {[['add', '+ Entrée', '#16A34A'], ['remove', '− Sortie', '#DC2626'], ['adjust', '⟳ Ajuster', '#6B7280']].map(([val, label, color]) => (
              <button
                key={val}
                type="button"
                onClick={() => setAction(val)}
                style={{ ...d.tab, ...(action === val ? { background: color, color: '#fff' } : {}) }}
              >
                {label}
              </button>
            ))}
          </div>

          <input
            type="number"
            min={action === 'adjust' ? 0 : 1}
            placeholder={action === 'adjust' ? 'Nouveau total' : 'Quantité'}
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            style={d.input}
            required
          />
          <input
            placeholder="Note (optionnel)"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            style={d.input}
          />
          {error && <p style={{ color: '#DC2626', fontSize: 13 }}>{error}</p>}
          <button type="submit" style={d.submitBtn} disabled={loading}>
            {loading ? 'Traitement...' : 'Valider'}
          </button>
        </form>

        {/* Historique des mouvements */}
        <h4 style={d.histTitle}>Historique</h4>
        <div style={d.movList}>
          {detail.stock?.movements?.slice(0, 10).map((m, i) => (
            <div key={i} style={d.movRow}>
              <span style={{ ...d.movType, color: TYPE_COLOR[m.type] ?? '#6B7280' }}>
                {m.type}
              </span>
              <span style={{ fontWeight: 700, color: m.quantity > 0 ? '#16A34A' : '#DC2626' }}>
                {m.quantity > 0 ? '+' : ''}{m.quantity}
              </span>
              <span style={d.movStock}>{m.stock_before} → {m.stock_after}</span>
              <span style={d.movNote}>{m.note ?? '—'}</span>
              <span style={d.movDate}>{new Date(m.moved_at).toLocaleDateString('fr-FR')}</span>
            </div>
          ))}
          {!detail.stock?.movements?.length && (
            <p style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center' }}>Aucun mouvement enregistré.</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function StockManager() {
  const [stocks, setStocks]       = useState([])
  const [alerts, setAlerts]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState(null) // produit sélectionné pour le détail
  const [showAlerts, setShowAlerts] = useState(false)
  const [filter, setFilter]       = useState({ low_stock: false, category_id: '' })
  const [categories, setCategories] = useState([])

  const loadStocks = () => {
    const params = {}
    if (filter.low_stock)   params.low_stock = 1
    if (filter.category_id) params.category_id = filter.category_id
    api.get('/admin/stocks', { params })
      .then(({ data }) => setStocks(data.data ?? data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data))
    api.get('/admin/stocks/alerts').then(({ data }) => setAlerts(data))
  }, [])

  useEffect(() => { loadStocks() }, [filter])

  return (
    <div style={s.page}>
      {/* Alerte stock bas */}
      {alerts.count > 0 && (
        <div style={s.alertBanner} onClick={() => setShowAlerts(!showAlerts)}>
          ⚠ {alerts.count} produit{alerts.count > 1 ? 's' : ''} en stock bas — Cliquer pour voir
        </div>
      )}
      {showAlerts && (
        <div style={s.alertList}>
          {alerts.products?.map((a) => (
            <span
              key={a.id}
              style={s.alertChip}
              onClick={() => setSelected(a.product)}
            >
              {a.product?.name} ({a.quantity} restants)
            </span>
          ))}
        </div>
      )}

      <div style={s.header}>
        <h2 style={s.title}>Gestion des stocks</h2>
        <div style={s.filters}>
          <select
            value={filter.category_id}
            onChange={(e) => setFilter({ ...filter, category_id: e.target.value })}
            style={s.select}
          >
            <option value="">Toutes catégories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label style={s.checkLabel}>
            <input
              type="checkbox"
              checked={filter.low_stock}
              onChange={(e) => setFilter({ ...filter, low_stock: e.target.checked })}
            />
            Stock bas seulement
          </label>
        </div>
      </div>

      {loading && <p style={{ textAlign: 'center', color: '#9CA3AF' }}>Chargement...</p>}

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Produit</th>
            <th style={s.th}>Catégorie</th>
            <th style={s.th}>Stock</th>
            <th style={s.th}>Seuil alerte</th>
            <th style={s.th}>État</th>
            <th style={s.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => {
            const isLow = stock.quantity <= stock.alert_threshold
            return (
              <tr key={stock.id} style={{ background: isLow ? '#FFF5F5' : '#fff' }}>
                <td style={s.td}>{stock.product?.name}</td>
                <td style={s.td}>{stock.product?.category?.name}</td>
                <td style={{ ...s.td, fontWeight: 700, color: isLow ? '#DC2626' : '#16A34A', fontSize: 16 }}>
                  {stock.quantity}
                </td>
                <td style={{ ...s.td, color: '#9CA3AF' }}>{stock.alert_threshold}</td>
                <td style={s.td}>
                  {isLow
                    ? <span style={s.badgeLow}>⚠ Bas</span>
                    : <span style={s.badgeOk}>✓ OK</span>}
                </td>
                <td style={s.td}>
                  <button style={s.detailBtn} onClick={() => setSelected(stock.product)}>
                    Gérer
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Panneau détail */}
      {selected && (
        <StockDetail
          product={selected}
          onClose={() => { setSelected(null); loadStocks() }}
        />
      )}
    </div>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = {
  page:        { padding: 16, fontFamily: 'system-ui, sans-serif' },
  alertBanner: {
    background: '#FEF3C7', border: '1px solid #FCD34D',
    borderRadius: 8, padding: '10px 16px', cursor: 'pointer',
    fontWeight: 600, color: '#92400E', marginBottom: 8,
  },
  alertList:  { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  alertChip:  {
    background: '#FEE2E2', color: '#991B1B', padding: '4px 10px',
    borderRadius: 99, fontSize: 12, cursor: 'pointer',
  },
  header:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 },
  title:   { fontSize: 20, fontWeight: 700, margin: 0 },
  filters: { display: 'flex', gap: 12, alignItems: 'center' },
  select:  { padding: '6px 10px', borderRadius: 6, border: '1px solid #D1D5DB' },
  checkLabel: { fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' },

  table:   { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #E5E7EB' },
  th:      { textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#6B7280', textTransform: 'uppercase', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' },
  td:      { padding: '10px 14px', fontSize: 14, borderBottom: '1px solid #F3F4F6' },
  badgeLow: { background: '#FEE2E2', color: '#991B1B', padding: '2px 8px', borderRadius: 99, fontSize: 12, fontWeight: 600 },
  badgeOk:  { background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: 99, fontSize: 12, fontWeight: 600 },
  detailBtn: { padding: '4px 12px', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
}

const d = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50,
  },
  panel: {
    background: '#fff', borderRadius: '16px 16px 0 0', width: '100%',
    maxWidth: 540, maxHeight: '85vh', overflowY: 'auto', padding: 20,
  },
  panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  panelTitle:  { fontSize: 18, fontWeight: 700, margin: 0 },
  closeBtn:    { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#6B7280' },
  stockBadge:  { borderRadius: 12, padding: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 },
  form:        { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 },
  tabRow:      { display: 'flex', gap: 4 },
  tab:         { flex: 1, padding: '6px 0', border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer', background: '#F9FAFB', fontSize: 13, fontWeight: 600 },
  input:       { padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 14 },
  submitBtn:   { padding: 12, background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' },
  histTitle:   { fontSize: 14, fontWeight: 700, marginBottom: 8, color: '#374151' },
  movList:     { display: 'flex', flexDirection: 'column', gap: 4 },
  movRow:      { display: 'flex', gap: 8, fontSize: 12, padding: '6px 0', borderBottom: '1px solid #F3F4F6', alignItems: 'center', flexWrap: 'wrap' },
  movType:     { fontWeight: 700, width: 80, flexShrink: 0 },
  movStock:    { color: '#9CA3AF' },
  movNote:     { flex: 1, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  movDate:     { color: '#9CA3AF', marginLeft: 'auto' },
}
