import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const editGuarantors = async (applicationId: string, obj) => {
  const url = API_BASE_URL + `/application/guarantors/${applicationId}`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
