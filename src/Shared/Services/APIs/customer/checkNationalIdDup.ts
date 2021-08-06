import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const checkDuplicates = async (key: string, value: string) => {
  const url = API_BASE_URL + `/customer/checkNID?${key}=${value}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
