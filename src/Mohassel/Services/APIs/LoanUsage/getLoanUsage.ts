import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const getLoanUsage = async () => {
  const url = API_BASE_URL + `/config/usage`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
