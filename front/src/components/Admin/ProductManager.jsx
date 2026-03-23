import { useEffect, useState } from 'react'
import api from '../../api/axios'

const EMPTY_FORM = { category_id: '', name: '', description: '', price: '', weight_kg: '', stock: '', is_active: true }

export default function ProductManager() {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm]             = useState(EMPTY_FORM)
  const [editing, setEditing]       = useState(null)
  const [errors, setErrors]         = useState({})
  const [filter, setFilter]         = useState({ category_id: '', search: '' })

  const load = () => {
    const params = {}
    if (filter.category_id) params.category_id = filter.category_id
    if (filter.search)      params.search = filter.search
    api.get('/admin/products', { params }).then(({ data }) => setProducts(data.data ?? data))
  }

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data))
  }, [])

  useEffect(() => { load() }, [filter])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    try {
      if (editing) {
        await api.put(`/admin/products/${editing}`, form)
        setEditing(null)
      } else {
        await api.post('/admin/products', form)
      }
      setForm(EMPTY_FORM)
      load()
    } catch (err) {
      setErrors(err.response?.data?.errors ?? {})
    }
  }

  const handleEdit = (p) => {
    setEditing(p.id)
    setForm({
      category_id: p.category_id,
      name: p.name,
      description: p.description ?? '',
      price: p.price,
      weight_kg: p.weight_kg,
      stock: p.stock ?? '',
      is_active: p.is_active,
    })
  }

  const handleToggle = async (p) => {
    await api.patch(`/admin/products/${p.id}/toggle`)
    load()
  }

  const handleDelete = async (p) => {
    if (!confirm(`Supprimer « ${p.name} » ?`)) return
    try {
      await api.delete(`/admin/products/${p.id}`)
      load()
    } catch (err) {
      alert(err.response?.data?.message ?? 'Erreur.')
    }
  }

  return (
    <div className="product-manager">
      <h2>Gestion des produits</h2>

      {/* Filtres */}
      <div className="filters">
        <select value={filter.category_id} onChange={(e) => setFilter({ ...filter, category_id: e.target.value })}>
          <option value="">Toutes les catégories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input
          placeholder="Recherche par nom..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />
      </div>

      {/* Formulaire ajout/modification */}
      <form onSubmit={handleSubmit} className="product-form">
        <h3>{editing ? 'Modifier le produit' : 'Nouveau produit'}</h3>

        <select name="category_id" value={form.category_id} onChange={handleChange} required>
          <option value="">-- Catégorie --</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {errors.category_id && <span className="error">{errors.category_id[0]}</span>}

        <input name="name" placeholder="Nom du produit" value={form.name} onChange={handleChange} required />
        {errors.name && <span className="error">{errors.name[0]}</span>}

        <textarea name="description" placeholder="Description (optionnel)" value={form.description} onChange={handleChange} rows={2} />

        <div className="form-row">
          <input name="price" type="number" step="0.01" placeholder="Prix (€)" value={form.price} onChange={handleChange} required />
          <input name="weight_kg" type="number" step="0.001" placeholder="Poids (kg)" value={form.weight_kg} onChange={handleChange} />
          <input name="stock" type="number" min="0" placeholder="Stock (vide = illimité)" value={form.stock} onChange={handleChange} />
        </div>

        <label>
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
          Produit actif
        </label>

        <div className="form-actions">
          <button type="submit">{editing ? 'Enregistrer' : 'Ajouter'}</button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm(EMPTY_FORM) }}>
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* Liste des produits */}
      <table className="products-table">
        <thead>
          <tr>
            <th>Nom</th><th>Catégorie</th><th>Prix</th><th>Poids</th><th>Stock</th><th>Statut</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ opacity: p.is_active ? 1 : 0.5 }}>
              <td>{p.name}</td>
              <td>{p.category?.name}</td>
              <td>{p.price} €</td>
              <td>{p.weight_kg} kg</td>
              <td>{p.stock ?? '∞'}</td>
              <td>
                <span style={{ color: p.is_active ? 'green' : 'red' }}>
                  {p.is_active ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td>
                <button onClick={() => handleEdit(p)}>Modifier</button>
                <button onClick={() => handleToggle(p)}>{p.is_active ? 'Désactiver' : 'Activer'}</button>
                <button onClick={() => handleDelete(p)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
