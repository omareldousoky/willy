import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const getBranchLoanList = async (obj) => {
  const url = API_BASE_URL + `/report/branch-issued-loans`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const postBranchLoanListExcel = async (obj) => {
  const url = API_BASE_URL + `/report/excel/branch-issued-loans`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getBranchLoanListExcel = async (id) => {
  const url = API_BASE_URL + `/report/excel/branch-issued-loans/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
