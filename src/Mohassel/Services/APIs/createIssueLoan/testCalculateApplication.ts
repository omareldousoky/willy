import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const testCalculateApplication = async (
  id: string,
  creationDate: number
) => {
  const url = API_BASE_URL + `/application/test-calculate-application/${id}`
  try {
    const res = await axios.put(url, { creationDate })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
