import { API_BASE_URL } from '../../../Shared/envConfig'
import axios from '../../../Shared/Services/axiosInstance'

const limitsURL = API_BASE_URL + '/config/cf-limit'
export const getCFLimits = async () => {
  try {
    const res = await axios.get(limitsURL)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const setCFLimits = async (obj) => {
  try {
    const res = await axios.post(limitsURL, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
