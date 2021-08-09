import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const testFreeRescheduling = async (applicationId: string, obj) => {
  const url =
    API_BASE_URL + `/loan/calculate-free-rescheduling/${applicationId}`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const freeRescheduling = async (applicationId: string, obj) => {
  const url = API_BASE_URL + `/loan/free-rescheduling/${applicationId}`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
