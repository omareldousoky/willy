import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const createClearance = async (data: FormData) => {
  const url = API_BASE_URL + '/application/clearance'
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
