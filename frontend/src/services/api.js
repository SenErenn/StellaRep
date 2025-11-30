import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const calculateReputation = async (stellarAddress, ethereumAddress = null) => {
  const payload = {
    stellarAddress,
    ethereumAddress: ethereumAddress || null,
  }
  const response = await api.post('/reputation/calculate', payload)
  return response.data
}

export const getReputation = async (stellarAddress) => {
  const response = await api.get(`/reputation/${stellarAddress}`)
  return response.data
}

export default api
