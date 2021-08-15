import { API_BASE_URL } from '../../../Shared/envConfig'
import axios from '../../../Shared/Services/axiosInstance'

interface Config {
  isHidden: boolean
}

export const hideDocument = async (data: Config, id: string) => {
  const url = API_BASE_URL + `/documents/config/document-type/hidden/${id}`
  try {
    const res = await axios.put(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
