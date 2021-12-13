import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const getLoanComments = async () => {
  const url = API_BASE_URL + `/config/review-notes`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
