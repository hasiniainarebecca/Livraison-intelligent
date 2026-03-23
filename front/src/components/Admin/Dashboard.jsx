import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/admin/reports').then(({ data }) => setStats(data))
  }, [])

  if (!stats) return <div>Chargement des statistiques...</div>

  return (
    <div className="admin-dashboard">
      <h2>Tableau de bord Admin</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total commandes</h3>
          <p>{stats.total_orders}</p>
        </div>
        <div className="stat-card">
          <h3>En attente</h3>
          <p>{stats.en_attente}</p>
        </div>
        <div className="stat-card">
          <h3>En cours</h3>
          <p>{stats.en_cours}</p>
        </div>
        <div className="stat-card">
          <h3>Livrées</h3>
          <p>{stats.livrees}</p>
        </div>
        <div className="stat-card">
          <h3>Annulées</h3>
          <p>{stats.annulees}</p>
        </div>
      </div>

      <h3>Commandes par catégorie</h3>
      <table>
        <thead>
          <tr><th>Catégorie</th><th>Total</th></tr>
        </thead>
        <tbody>
          {stats.par_categorie.map((row) => (
            <tr key={row.category_id}>
              <td>{row.category?.name ?? '—'}</td>
              <td>{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
