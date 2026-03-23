import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import CartDrawer from '../Common/CartDrawer'

export default function Catalog() {
  const [categories, setCategories]   = useState([])
  const [products, setProducts]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [activeCategory, setActiveCategory] = useState('')
  const [search, setSearch]           = useState('')
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [added, setAdded]             = useState({}) // flash "ajouté" par produit

  const { addToCart, totalItems, totalPrice } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (activeCategory) params.category_id = activeCategory
    if (search)         params.search = search
    api.get('/products', { params })
      .then(({ data }) => setProducts(data.data ?? data))
      .finally(() => setLoading(false))
  }, [activeCategory, search])

  const handleAdd = (product) => {
    addToCart(product)
    setAdded((prev) => ({ ...prev, [product.id]: true }))
    setTimeout(() => setAdded((prev) => ({ ...prev, [product.id]: false })), 1200)
  }

  const handleCheckout = () => {
    if (totalItems === 0) return
    if (!user || user.role !== 'client') {
      navigate('/login?redirect=/client/orders/new')
    } else {
      navigate('/client/orders/new')
    }
  }

  return (
    <div style={s.page}>
      {/* En-tête catalogue */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <h1 style={s.heroTitle}>Catalogue</h1>
          <p style={s.heroSub}>Parcourez nos produits et composez votre commande</p>
          <button style={s.cartBtn} onClick={() => setDrawerOpen(true)}>
            🛒 Panier
            {totalItems > 0 && <span style={s.cartBadge}>{totalItems}</span>}
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div style={s.filters}>
        {/* Catégories */}
        <div style={s.categoryTabs}>
          <button
            style={{ ...s.catTab, ...(activeCategory === '' ? s.catTabActive : {}) }}
            onClick={() => setActiveCategory('')}
          >
            Tout
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              style={{ ...s.catTab, ...(activeCategory === String(c.id) ? s.catTabActive : {}) }}
              onClick={() => setActiveCategory(String(c.id))}
            >
              {c.icon && <span style={{ marginRight: 4 }}>{c.icon}</span>}
              {c.name}
            </button>
          ))}
        </div>

        {/* Recherche */}
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={s.searchInput}
        />
      </div>

      {/* Grille produits */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>Chargement...</p>
      ) : (
        <div style={s.grid}>
          {products.map((product) => (
            <div key={product.id} style={s.card}>
              {/* Image placeholder */}
              <div style={{ ...s.imgBox, background: product.category?.color ?? '#E5E7EB' }}>
                <span style={{ fontSize: 40 }}>{product.category?.icon ?? '📦'}</span>
              </div>

              <div style={s.cardBody}>
                <div style={s.catBadge}>{product.category?.name}</div>
                <h3 style={s.productName}>{product.name}</h3>
                {product.description && (
                  <p style={s.description}>{product.description}</p>
                )}
                <div style={s.footer}>
                  <span style={s.price}>{parseFloat(product.price).toFixed(2)} €</span>
                  <button
                    style={{ ...s.addBtn, ...(added[product.id] ? s.addBtnAdded : {}) }}
                    onClick={() => handleAdd(product)}
                  >
                    {added[product.id] ? '✓ Ajouté' : '+ Panier'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#9CA3AF' }}>
              Aucun produit trouvé.
            </div>
          )}
        </div>
      )}

      {/* Bouton flottant commander */}
      {totalItems > 0 && (
        <button style={s.fabBtn} onClick={handleCheckout}>
          🛒 Commander ({totalItems} article{totalItems > 1 ? 's' : ''}) — {totalPrice.toFixed(2)} €
        </button>
      )}

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#F9FAFB', fontFamily: 'system-ui, sans-serif', paddingBottom: 80 },

  hero: { background: 'linear-gradient(135deg, #1E293B 0%, #3B82F6 100%)', padding: '40px 20px' },
  heroInner: { maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 },
  heroTitle: { fontSize: 32, fontWeight: 800, color: '#fff', margin: 0 },
  heroSub:   { color: '#BAE6FD', margin: '4px 0 0', fontSize: 15 },
  cartBtn: {
    background: '#fff', color: '#1E293B', border: 'none',
    borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 15,
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, position: 'relative',
  },
  cartBadge: {
    background: '#EF4444', color: '#fff', borderRadius: '50%',
    width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700,
  },

  filters: { maxWidth: 1000, margin: '0 auto', padding: '20px 16px 0' },
  categoryTabs: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  catTab: {
    padding: '6px 14px', borderRadius: 99, border: '1px solid #D1D5DB',
    background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151',
  },
  catTabActive: { background: '#3B82F6', color: '#fff', borderColor: '#3B82F6' },
  searchInput: {
    width: '100%', maxWidth: 400, padding: '8px 14px',
    border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 14,
    boxSizing: 'border-box',
  },

  grid: {
    maxWidth: 1000, margin: '20px auto 0', padding: '0 16px',
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20,
  },
  card: {
    background: '#fff', borderRadius: 14, overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column',
  },
  imgBox: {
    height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: 0.85,
  },
  cardBody:    { padding: 16, display: 'flex', flexDirection: 'column', flex: 1, gap: 6 },
  catBadge:    { fontSize: 11, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' },
  productName: { fontSize: 15, fontWeight: 700, margin: 0, color: '#111827' },
  description: { fontSize: 12, color: '#6B7280', margin: 0, flexGrow: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
  footer:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 8 },
  price:       { fontWeight: 800, fontSize: 17, color: '#111827' },
  addBtn: {
    background: '#3B82F6', color: '#fff', border: 'none',
    borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
    transition: 'background 0.2s',
  },
  addBtnAdded: { background: '#10B981' },

  fabBtn: {
    position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
    background: '#10B981', color: '#fff', border: 'none', borderRadius: 99,
    padding: '14px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)', zIndex: 50, whiteSpace: 'nowrap',
  },
}
