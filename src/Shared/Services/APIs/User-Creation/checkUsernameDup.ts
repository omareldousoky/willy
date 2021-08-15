import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const checkUsernameDuplicates = async (username: string) => {
  const url = API_BASE_URL + `/user/checkNID?username=${username}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
