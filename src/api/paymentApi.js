import { api } from './axiosInstance'

export async function createPaymentIntent(contestId) {
  const { data } = await api.post('/payments/create-intent', { contestId })
  return data.data
}

export async function confirmRegistration(payload) {
  const { data } = await api.post('/payments/confirm-registration', payload)
  return data.data
}

export async function getRegistrationStatus(contestId) {
  const { data } = await api.get(`/registrations/check/${contestId}`)
  return data.data
}

export async function getMyRegistrations() {
  const { data } = await api.get('/registrations/my')
  return data.data
}
