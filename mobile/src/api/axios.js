import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { navigate } from '../navigation/navigationRef'

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Injecter le token Sanctum automatiquement
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Gérer les erreurs 401 globalement
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token')
      navigate('Login')
    }
    return Promise.reject(error)
  }
)

export default api
