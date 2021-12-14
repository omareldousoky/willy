import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const updateLoanComment = async (
  id: string,
  name: string,
  activated: boolean
) => {
  const url = API_BASE_URL + `/config/review-notes/${id}`
  try {
    const res = await axios.put(url, { name, activated })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
