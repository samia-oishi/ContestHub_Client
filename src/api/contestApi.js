import { api } from './axiosInstance'

export async function getPopularContests() {
  const { data } = await api.get('/contests/popular?limit=5')
  return data.data
}

export async function getContestTypes() {
  const { data } = await api.get('/contests/types')
  return data.data
}

export async function getApprovedContests(params = {}) {
  const { data } = await api.get('/contests', { params })
  return data.data
}

export async function getContestDetails(id) {
  const { data } = await api.get(`/contests/${id}`)
  return data.data
}
