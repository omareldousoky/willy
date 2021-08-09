import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const checkHRCodeDuplicates = async (hrCode: string, id?: string) => {
  const url = API_BASE_URL + `/user/check-hr-code?hrCode=${hrCode}&userId=${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
