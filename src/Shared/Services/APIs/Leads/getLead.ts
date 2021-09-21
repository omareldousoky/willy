import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const getLead = async (uuid: string, phoneNumber: string) => {
  const url = API_BASE_URL + `/lead/get/${uuid}?phoneNumber=${phoneNumber}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
