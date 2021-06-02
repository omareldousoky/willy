import axios from '../axios-instance'

export const getApplicationLogs = async (
  applicationId: string,
  size: number,
  from: number
) => {
  const url =
    process.env.REACT_APP_BASE_URL +
    `/search/log/loan/${applicationId}?size=${size}&from=${from}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getApplicationTransactionLogs = async (
  applicationId: string,
  size: number,
  pageToken: string
) => {
  const url =
    process.env.REACT_APP_BASE_URL +
    `/application/${applicationId}/transactions?size=${size}&pageToken=${pageToken}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
