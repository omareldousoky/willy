import { CustomerGuaranteedReportRequest } from '../../../../Models/finanicalReports'
import { API_BASE_URL } from '../../../../envConfig'
import axios from '../../../axiosInstance'

const customerGuaranteedRequestURL = API_BASE_URL + `/report/excel/guarantors`
export const postCustomerGuaranteedExcel = async (
  request: CustomerGuaranteedReportRequest
) => {
  try {
    const res = await axios.post(customerGuaranteedRequestURL, request)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getCustomerGuaranteedExcel = async (id) => {
  const url = customerGuaranteedRequestURL + `/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
