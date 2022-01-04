import { ReviewedLoansRequest } from '../../../../Models/finanicalReports'
import { API_BASE_URL } from '../../../../envConfig'
import axios from '../../../axiosInstance'

const postponesRequestURL =
  API_BASE_URL + `/report/excel/loans-reviewed-by-review-date`
export const postReviewedLoansExcel = async (request: ReviewedLoansRequest) => {
  try {
    const res = await axios.post(postponesRequestURL, request)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getReviewedLoansExcel = async (id) => {
  const url = postponesRequestURL + `/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
