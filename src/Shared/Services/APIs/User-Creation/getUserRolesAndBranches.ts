import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const getUserRolesAndBranches = async () => {
  const urls = [API_BASE_URL + `/user/role`, API_BASE_URL + '/branch']
  try {
    return await Promise.all(
      urls.map(async (url) => {
        const res = await axios.get(url)
        return { status: 'success', body: res.data }
      })
    )
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
