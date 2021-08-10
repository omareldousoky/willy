import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const quarterlyReport = async (data: object) => {
  const url = API_BASE_URL + '/report/quarterly-report'
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const postQuarterlyReportExcel = async (obj) => {
  const url = API_BASE_URL + `/report/excel/quarterly-report`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getQuarterlyReportExcel = async (id) => {
  const url = API_BASE_URL + `/report/excel/quarterly-report/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
