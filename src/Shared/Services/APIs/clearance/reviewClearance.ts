import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const reviewClearance = async (id: string, data: object) => {
  const url = API_BASE_URL + `/application/review-clearance/${id}`
  try {
    const res = await axios.put(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
