import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const getRollableActionsById = async (applicationId: string) => {
  const url = API_BASE_URL + `/loan/available-rollbacks/${applicationId}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const rollbackActionByID = async (
  data: object,
  applicationId: string
) => {
  const url = API_BASE_URL + `/loan/rollback-action/${applicationId}`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
