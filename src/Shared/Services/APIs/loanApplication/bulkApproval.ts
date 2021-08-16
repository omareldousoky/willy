import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const bulkApproval = async (data: object) => {
  const url = API_BASE_URL + `/application/bulk-approve`
  try {
    const res = await axios.put(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
