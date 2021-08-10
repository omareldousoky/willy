import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const doubtfulLoans = async (data) => {
  const url = API_BASE_URL + `/report/loan-doubts`
  try {
    const res = await axios({
      method: 'POST',
      url,
      data,
    })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const postDoubtfulLoansExcel = async (obj) => {
  const url = API_BASE_URL + `/report/excel/loan-doubts`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getDoubtfulLoansExcel = async (id) => {
  const url = API_BASE_URL + `/report/excel/loan-doubts/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
