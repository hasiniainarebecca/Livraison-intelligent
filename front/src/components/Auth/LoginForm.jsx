import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      // Si un redirect est spécifié dans l'URL (?redirect=...), l'utiliser
      const redirect = searchParams.get('redirect')
      if (redirect) {
        navigate(redirect)
        return
      }
      // Sinon, rediriger selon le rôle
      const redirects = { client: '/client/orders', livreur: '/livreur', admin: '/admin' }
      navigate(redirects[user.role] ?? '/')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Erreur de connexion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🚪</div>
        <h2 style={s.title}>Connexion</h2>
        <p style={s.sub}>Bienvenue sur Porte Ouverte</p>

        {searchParams.get('redirect') && (
          <div style={s.info}>Connectez-vous pour continuer votre commande.</div>
        )}

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              style={s.input}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoFocus
              placeholder="admin@test.com"
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Mot de passe</label>
            <input
              type="password"
              style={s.input}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p style={s.footer}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: '#3B82F6' }}>S'inscrire</Link>
        </p>
        <p style={s.footer}>
          <Link to="/catalog" style={{ color: '#6B7280', fontSize: 13 }}>
            Parcourir le catalogue sans connexion →
          </Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  page:  { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', padding: 16 },
  card:  { background: '#fff', borderRadius: 16, padding: 40, width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' },
  logo:  { fontSize: 48, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 700, textAlign: 'center', margin: 0 },
  sub:   { color: '#6B7280', textAlign: 'center', marginTop: 4, marginBottom: 24 },
  info:  { background: '#EFF6FF', color: '#1D4ED8', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
  error: { background: '#FEF2F2', color: '#DC2626', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
  form:  { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  input: { padding: '10px 14px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 14 },
  btn:   { padding: '12px 0', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 4 },
  footer: { textAlign: 'center', marginTop: 16, fontSize: 14, color: '#6B7280' },
}
