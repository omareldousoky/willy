import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const updateManagerHierarchy = async (data: object, id: string) => {
  const url = API_BASE_URL + `/branch/${id}/managers-hierarchy`
  try {
    const res = await axios.put(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
