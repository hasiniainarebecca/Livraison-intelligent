import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function UserManager() {
  const [users, setUsers]       = useState([])
  const [filter, setFilter]     = useState({ role: '', search: '' })
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ name: '', email: '', password: '', role: 'livreur', phone: '' })
  const [errors, setErrors]     = useState({})

  const load = () => {
    const params = {}
    if (filter.role)   params.role = filter.role
    if (filter.search) params.search = filter.search
    api.get('/admin/users', { params }).then(({ data }) => setUsers(data.data ?? data))
  }

  useEffect(() => { load() }, [filter])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    try {
      await api.post('/admin/users', form)
      setForm({ name: '', email: '', password: '', role: 'livreur', phone: '' })
      setShowForm(false)
      load()
    } catch (err) {
      setErrors(err.response?.data?.errors ?? {})
    }
  }

  const handleToggle = async (user) => {
    try {
      const { data } = await api.patch(`/admin/users/${user.id}/toggle`)
      alert(data.message)
      load()
    } catch (err) {
      alert(err.response?.data?.message ?? 'Erreur.')
    }
  }

  const ROLE_LABELS = { client: 'Client', livreur: 'Livreur', admin: 'Admin' }

  return (
    <div className="user-manager">
      <div className="header-row">
        <h2>Gestion des utilisateurs</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Fermer' : '+ Créer livreur / admin'}
        </button>
      </div>

      {/* Formulaire création */}
      {showForm && (
        <form onSubmit={handleSubmit} className="user-form">
          <input name="name" placeholder="Nom complet" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input name="email" type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input name="password" type="password" placeholder="Mot de passe" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <input name="phone" placeholder="Téléphone" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="livreur">Livreur</option>
            <option value="admin">Admin</option>
          </select>
          {Object.entries(errors).map(([k, v]) => (
            <span key={k} className="error">{v[0]}</span>
          ))}
          <button type="submit">Créer</button>
        </form>
      )}

      {/* Filtres */}
      <div className="filters">
        <select value={filter.role} onChange={(e) => setFilter({ ...filter, role: e.target.value })}>
          <option value="">Tous les rôles</option>
          <option value="client">Clients</option>
          <option value="livreur">Livreurs</option>
          <option value="admin">Admins</option>
        </select>
        <input placeholder="Recherche nom / email..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })} />
      </div>

      {/* Tableau */}
      <table>
        <thead>
          <tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Téléphone</th><th>Statut</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{ROLE_LABELS[u.role]}</td>
              <td>{u.phone ?? '—'}</td>
              <td style={{ color: u.is_active ? 'green' : 'red' }}>
                {u.is_active ? 'Actif' : 'Suspendu'}
              </td>
              <td>
                <button onClick={() => handleToggle(u)}>
                  {u.is_active ? 'Suspendre' : 'Activer'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
