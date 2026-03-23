import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function CategoryManager() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', description: '', icon: '', color: '#3B82F6' })
  const [editing, setEditing] = useState(null)

  const load = () => api.get('/categories').then(({ data }) => setCategories(data))

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      await api.put(`/admin/categories/${editing}`, form)
      setEditing(null)
    } else {
      await api.post('/admin/categories', form)
    }
    setForm({ name: '', description: '', icon: '', color: '#3B82F6' })
    load()
  }

  const handleEdit = (cat) => {
    setEditing(cat.id)
    setForm({ name: cat.name, description: cat.description ?? '', icon: cat.icon ?? '', color: cat.color ?? '#3B82F6' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return
    try {
      await api.delete(`/admin/categories/${id}`)
      load()
    } catch (err) {
      alert(err.response?.data?.message ?? 'Erreur lors de la suppression.')
    }
  }

  return (
    <div className="category-manager">
      <h2>Gestion des catégories</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nom" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} required
        />
        <input
          placeholder="Description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          placeholder="Icône (ex: cpu)" value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
        />
        <input
          type="color" value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
        />
        <button type="submit">{editing ? 'Modifier' : 'Ajouter'}</button>
        {editing && (
          <button type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '', icon: '', color: '#3B82F6' }) }}>
            Annuler
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr><th>Couleur</th><th>Nom</th><th>Icône</th><th>Actif</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td><span style={{ background: cat.color, display: 'inline-block', width: 20, height: 20, borderRadius: 4 }} /></td>
              <td>{cat.name}</td>
              <td>{cat.icon}</td>
              <td>{cat.is_active ? '✓' : '✗'}</td>
              <td>
                <button onClick={() => handleEdit(cat)}>Modifier</button>
                <button onClick={() => handleDelete(cat.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
