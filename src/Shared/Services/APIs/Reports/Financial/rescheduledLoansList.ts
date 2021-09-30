import { API_BASE_URL } from '../../../../envConfig'
import axios from '../../../axiosInstance'

export const getRescheduledLoanList = async (obj) => {
  const url = API_BASE_URL + `/report/loan-rescheduling`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const postRescheduledLoanExcel = async (obj) => {
  const url = API_BASE_URL + `/report/excel/loan-rescheduling`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getRescheduledLoanExcel = async (id) => {
  const url = API_BASE_URL + `/report/excel/loan-rescheduling/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
