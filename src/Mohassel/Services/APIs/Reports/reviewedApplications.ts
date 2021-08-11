import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'
import { LoanApplicationReportRequest } from '../../interfaces'

export const getReviewedApplications = async (
  obj: LoanApplicationReportRequest
) => {
  const url = API_BASE_URL + `/report/loans-reviewed`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
