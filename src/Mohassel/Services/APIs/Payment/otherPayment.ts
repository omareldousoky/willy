import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const otherPayment = async ({ id, data }) => {
  const url = API_BASE_URL + `/loan/other-payment/${id}`
  try {
    const res = await axios({ method: 'PUT', url, data })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
