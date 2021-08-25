import { API_BASE_URL } from '../../../Shared/envConfig'
import axios from '../../../Shared/Services/axiosInstance'

export const getCFLimits = async () => {
  const url = API_BASE_URL + '/config/cf-limit'
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const setCFLimits = async (obj) => {
  const url = API_BASE_URL + '/config/cf-limit'
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
