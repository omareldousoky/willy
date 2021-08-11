import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const cibExtractions = async (batchDate: number) => {
  const url = API_BASE_URL + `/application/cib-extractions`
  try {
    const res = await axios.post(url, { batchDate })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
