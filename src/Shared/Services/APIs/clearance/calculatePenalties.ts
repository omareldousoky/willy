import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const calculatePenalties = async ({ id, truthDate }) => {
  const url = API_BASE_URL + `/loan/calculate-penalties/${id}`
  try {
    const res = await axios({ method: 'PUT', url, data: { truthDate } })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
