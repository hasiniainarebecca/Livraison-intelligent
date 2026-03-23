import { useEffect, useState } from 'react'
import api from '../../api/axios'

/**
 * Catalogue produits avec filtres par catégorie.
 * Props:
 *   onAddToCart(product) — appelé quand le client veut ajouter un produit
 *   cart — tableau [{product, quantity}] pour afficher les qtés déjà choisies
 */
export default function ProductList({ onAddToCart, cart = [] }) {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState({ category_id: '', search: '' })
  const [page, setPage]             = useState(1)
  const [meta, setMeta]             = useState(null)

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { page }
    if (filter.category_id) params.category_id = filter.category_id
    if (filter.search)      params.search = filter.search

    api.get('/products', { params })
      .then(({ data }) => {
        setProducts(data.data)
        setMeta({ current_page: data.current_page, last_page: data.last_page })
      })
      .finally(() => setLoading(false))
  }, [filter, page])

  const getCartQty = (productId) =>
    cart.find((i) => i.product.id === productId)?.quantity ?? 0

  return (
    <div className="product-list">
      {/* Filtres */}
      <div className="filters">
        <select
          value={filter.category_id}
          onChange={(e) => { setFilter({ ...filter, category_id: e.target.value }); setPage(1) }}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Rechercher un produit..."
          value={filter.search}
          onChange={(e) => { setFilter({ ...filter, search: e.target.value }); setPage(1) }}
        />
      </div>

      {loading && <p>Chargement des produits...</p>}

      {/* Grille produits */}
      <div className="products-grid">
        {products.map((product) => {
          const qty = getCartQty(product.id)
          return (
            <div key={product.id} className="product-card">
              {product.image && (
                <img src={product.image} alt={product.name} className="product-img" />
              )}
              <div className="product-info">
                <span className="product-category">{product.category?.name}</span>
                <h3>{product.name}</h3>
                {product.description && <p>{product.description}</p>}
                <div className="product-meta">
                  <strong>{product.price} €</strong>
                  <span>{product.weight_kg} kg</span>
                  {product.stock !== null && (
                    <span>Stock : {product.stock}</span>
                  )}
                </div>
              </div>
              <button
                className={qty > 0 ? 'btn-added' : 'btn-add'}
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
              >
                {qty > 0 ? `Ajouté (×${qty})` : 'Ajouter'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>‹ Précédent</button>
          <span>Page {meta.current_page} / {meta.last_page}</span>
          <button disabled={page === meta.last_page} onClick={() => setPage(page + 1)}>Suivant ›</button>
        </div>
      )}
    </div>
  )
}
