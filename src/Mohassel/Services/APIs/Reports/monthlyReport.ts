import axios from '../../../../Shared/Services/axiosInstance'

export const monthlyReport = async () => {
  const url = process.env.REACT_APP_BASE_URL + '/report/monthly-report'
  try {
    const res = await axios.post(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const postMonthlyReportExcel = async () => {
  const url = process.env.REACT_APP_BASE_URL + `/report/excel/monthly-report`
  try {
    const res = await axios.post(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getMonthlyReportExcel = async (id) => {
  const url =
    process.env.REACT_APP_BASE_URL + `/report/excel/monthly-report/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
