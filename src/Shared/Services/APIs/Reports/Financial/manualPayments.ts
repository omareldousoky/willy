import { API_BASE_URL } from '../../../../envConfig'
import axios from '../../../axiosInstance'

export const getManualPayments = async (obj) => {
  const url = API_BASE_URL + `/report/manual-payments`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const postManualPaymentsExcel = async (obj) => {
  const url = API_BASE_URL + `/report/excel/manual-payments`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getManualPaymentsExcel = async (id) => {
  const url = API_BASE_URL + `/report/excel/manual-payments/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
