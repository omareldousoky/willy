import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const checkBranchNameDuplicates = async (branchName: object) => {
  const url = API_BASE_URL + '/branch/check-branch-name'
  try {
    const res = await axios.post(url, branchName)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
