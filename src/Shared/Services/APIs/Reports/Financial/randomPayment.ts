import { API_BASE_URL } from '../../../../envConfig'
import axios from '../../../axiosInstance'

export const getRandomPayments = async (obj) => {
  const url = API_BASE_URL + `/report/random-payments`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const postRandomPaymentsExcel = async (obj) => {
  const url = API_BASE_URL + `/report/excel/random-payments`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getRandomPaymentsExcel = async (id) => {
  const url = API_BASE_URL + `/report/excel/random-payments/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
