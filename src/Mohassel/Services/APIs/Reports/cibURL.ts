import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const cibTpayURL = async (fileKey: string) => {
  try {
    const url = `${API_BASE_URL}/report/tpay-file?fileKey=${fileKey}`
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
