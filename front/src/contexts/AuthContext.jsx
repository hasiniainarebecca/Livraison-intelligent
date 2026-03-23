import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/auth/me')
        .then(({ data }) => setUser(data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  // const logout = async () => {
  //   await api.post('/auth/logout').catch(() => {})
  //   localStorage.removeItem('token')
  //   setUser(null)
  // }

  const logout = async () => {
  try {
    await api.post('/auth/logout')  // envoie la requête de logout au backend
  } catch {}
  localStorage.removeItem('token')  // supprime le token du navigateur
  setUser(null)                     // réinitialise le state user
  window.location.href = '/login'   // force le rechargement complet sur la page login
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
