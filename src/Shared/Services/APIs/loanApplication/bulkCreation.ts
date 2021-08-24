import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

interface BulkCreationObj {
  creationDate: number
  applicationIds: Array<string>
}

export const bulkCreation = async (data: BulkCreationObj) => {
  const url = API_BASE_URL + `/application/bulk-create`
  try {
    const res = await axios.put(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
