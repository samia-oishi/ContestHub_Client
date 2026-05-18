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

export async function createContest(payload) {
  const { data } = await api.post('/contests', payload)
  return data.data
}

export async function getMyCreatedContests() {
  const { data } = await api.get('/contests/mine')
  return data.data
}

export async function getMyContestDetails(id) {
  const { data } = await api.get(`/contests/mine/${id}`)
  return data.data
}

export async function updateContest(id, payload) {
  const { data } = await api.patch(`/contests/${id}`, payload)
  return data.data
}

export async function deleteContest(id) {
  const { data } = await api.delete(`/contests/${id}`)
  return data.data
}
