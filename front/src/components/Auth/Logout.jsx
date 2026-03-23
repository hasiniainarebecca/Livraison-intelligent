import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Logout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const doLogout = async () => {
      await logout()                       // Déconnexion côté backend / token
      navigate('/login', { replace: true }) // Redirection vers login
    }
    doLogout()
  }, [])

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <p>Déconnexion en cours...</p>
    </div>
  )
}