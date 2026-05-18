import { api } from './axiosInstance'

export async function getCurrentUser() {
  const { data } = await api.get('/users/me')
  return data.data
}

export async function updateMyProfile(payload) {
  const { data } = await api.patch('/users/me', payload)
  return data.data
}

export async function getMyWinningRegistrations() {
  const { data } = await api.get('/registrations/wins')
  return data.data
}

export async function getProfileStats() {
  const { data } = await api.get('/stats/profile')
  return data.data
}
