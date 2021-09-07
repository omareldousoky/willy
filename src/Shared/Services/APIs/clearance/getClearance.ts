import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const getClearance = async (id: string) => {
  const url = API_BASE_URL + `/application/clearance/${id}`
  try {
    const res = await axios.post(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
