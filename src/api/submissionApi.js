import { api } from './axiosInstance'

export async function createSubmission(payload) {
  const { data } = await api.post('/submissions', payload)
  return data.data
}

export async function getSubmissionStatus(contestId) {
  const { data } = await api.get(`/submissions/check/${contestId}`)
  return data.data
}

export async function getCreatorSubmissions() {
  const { data } = await api.get('/submissions/creator')
  return data.data
}

export async function declareWinner(submissionId) {
  const { data } = await api.patch(`/submissions/${submissionId}/winner`)
  return data.data
}
