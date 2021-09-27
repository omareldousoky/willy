import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const createLead = async (obj) => {
  const url = API_BASE_URL + '/lead'
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error: any) {
    return { status: 'error', error: error.response.data }
  }
}
