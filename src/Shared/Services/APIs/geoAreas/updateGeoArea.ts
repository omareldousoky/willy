import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const updateGeoArea = async (id: string, obj: any) => {
  const url = API_BASE_URL + `/config/geo-areas/${id}`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
