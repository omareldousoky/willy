import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const unApproveOfficersGroups = async (data: object) => {
  const url = API_BASE_URL + '/branch/unapprove-officers-group'
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
