import { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AsyncStorage.getItem('token').then((token) => {
      if (token) {
        api.get('/auth/me')
          .then(({ data }) => setUser(data))
          .catch(() => AsyncStorage.removeItem('token'))
          .finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    await AsyncStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData)
    await AsyncStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    await api.post('/auth/logout').catch(() => {})
    await AsyncStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
