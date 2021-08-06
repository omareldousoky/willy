import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const testPostponeHalfInstallment = async (
  applicationId: string,
  obj
) => {
  const url = API_BASE_URL + `/loan/test-push-half-installment/${applicationId}`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const postponeHalfInstallment = async (applicationId: string, obj) => {
  const url = API_BASE_URL + `/loan/push-half-installment/${applicationId}`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
