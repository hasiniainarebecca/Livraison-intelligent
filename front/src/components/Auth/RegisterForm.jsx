import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function RegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '',
    phone: '', role: 'client',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const user = await register(form)
      navigate(user.role === 'livreur' ? '/livreur' : '/client')
    } catch (err) {
      setErrors(err.response?.data?.errors ?? {})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        {[
          { label: 'Nom complet', name: 'name', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Téléphone', name: 'phone', type: 'tel' },
          { label: 'Mot de passe', name: 'password', type: 'password' },
          { label: 'Confirmer le mot de passe', name: 'password_confirmation', type: 'password' },
        ].map(({ label, name, type }) => (
          <label key={name}>
            {label}
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              required={name !== 'phone'}
            />
            {errors[name] && <span className="error">{errors[name][0]}</span>}
          </label>
        ))}

        <label>
          Rôle
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="client">Client</option>
            <option value="livreur">Livreur</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Inscription...' : "S'inscrire"}
        </button>
      </form>
      <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
    </div>
  )
}
