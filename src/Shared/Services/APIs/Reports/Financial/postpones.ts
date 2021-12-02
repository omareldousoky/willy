import { PostponesReportRequest } from '../../../../Models/finanicalReports'
import { API_BASE_URL } from '../../../../envConfig'
import axios from '../../../axiosInstance'

const postponesRequestURL = API_BASE_URL + `/report/excel/postpones`
export const postPostponesExcel = async (request: PostponesReportRequest) => {
  try {
    const res = await axios.post(postponesRequestURL, request)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getPostponesExcel = async (id) => {
  const url = postponesRequestURL + `/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
