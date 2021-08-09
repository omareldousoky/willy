import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const createLoan = async (id: string, creationDate: number) => {
  const url = API_BASE_URL + `/application/create/${id}`
  try {
    const res = await axios.put(url, { creationDate })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
