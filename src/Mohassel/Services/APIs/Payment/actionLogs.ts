import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const actionLogs = async (data) => {
  const url = API_BASE_URL + `/search/log`
  try {
    const res = await axios({ method: 'POST', url, data })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
