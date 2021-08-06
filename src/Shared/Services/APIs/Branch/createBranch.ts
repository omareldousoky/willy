import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const createBranch = async (data: object) => {
  const url = API_BASE_URL + '/branch'
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
