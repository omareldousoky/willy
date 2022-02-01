import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

interface SearchUserByActionObj {
  size: number
  from: number
  serviceKey: string
  action: string
  branchId?: string
  name?: string
}
export const searchUserByAction = async (obj: SearchUserByActionObj) => {
  const params = {
    size: obj.size,
    from: obj.from,
    serviceKey: obj.serviceKey,
    action: obj.action,
    branchId: obj.branchId ? obj.branchId : '',
    name: obj.name ? obj.name : '',
  }
  const url = API_BASE_URL + `/search/user-by-action`
  try {
    const res = await axios.get(url, { params })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
