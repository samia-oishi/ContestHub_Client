import { api } from './axiosInstance'

export async function getRecentWinners(limit = 3) {
  const { data } = await api.get('/stats/winners', { params: { limit } })
  return data.data
}

export async function getLeaderboard(limit = 20) {
  const { data } = await api.get('/stats/leaderboard', { params: { limit } })
  return data.data
}
