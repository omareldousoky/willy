import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const calculatePenalties = async ({ id, truthDate }) => {
  const url = API_BASE_URL + `/loan/calculate-penalties/${id}`
  try {
    const res = await axios({ method: 'PUT', url, data: { truthDate } })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
