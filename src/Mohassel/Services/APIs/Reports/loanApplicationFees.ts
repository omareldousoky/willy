import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const getLoanApplicationFees = async (obj) => {
  const url = API_BASE_URL + `/report/loan-fees`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const postLoanApplicationFeesExcel = async (obj) => {
  const url = API_BASE_URL + `/report/excel/loan-fees`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getLoanApplicationFeesExcel = async (id) => {
  const url = API_BASE_URL + `/report/excel/loan-fees/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
