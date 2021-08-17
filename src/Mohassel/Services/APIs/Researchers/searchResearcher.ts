import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

interface SearchResearcher {
  branchId: string
  size: number
  from: number
  name?: string
}
export const searchResearcher = async (data: SearchResearcher) => {
  const url = API_BASE_URL + `/search/researcher`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
