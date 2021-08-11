import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const getApplicationLogs = async (
  applicationId: string,
  size: number,
  from: number
) => {
  const url =
    API_BASE_URL + `/search/log/loan/${applicationId}?size=${size}&from=${from}`
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
    API_BASE_URL +
    `/application/${applicationId}/transactions?size=${size}&pageToken=${pageToken}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
