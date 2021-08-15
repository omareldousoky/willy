import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const editCustomer = async (data: object, id: string) => {
  const url = API_BASE_URL + `/customer/${id}`
  try {
    const res = await axios.put(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
