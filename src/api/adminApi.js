import { api } from './axiosInstance'

export async function getUsers(page = 1) {
  const { data } = await api.get('/users', { params: { page, limit: 10 } })
  return data.data
}

export async function updateUserRole(id, role) {
  const { data } = await api.patch(`/users/${id}/role`, { role })
  return data.data
}

export async function getAdminContests({ page = 1, status } = {}) {
  const { data } = await api.get('/contests/admin/all', { params: { page, limit: 10, status: status === 'all' ? undefined : status } })
  return data.data
}

export async function updateContestStatus(id, status) {
  const { data } = await api.patch(`/contests/${id}/status`, { status })
  return data.data
}

export async function deleteContestAsAdmin(id) {
  const { data } = await api.delete(`/contests/${id}`)
  return data.data
}
