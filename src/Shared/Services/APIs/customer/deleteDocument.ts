import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const deleteDocument = async (data: object) => {
  const url = API_BASE_URL + `/customer/document`
  try {
    const res = await axios.delete(url, { data })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
