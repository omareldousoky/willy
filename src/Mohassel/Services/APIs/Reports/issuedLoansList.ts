import axios from '../../../../Shared/Services/axiosInstance'

export const getIssuedLoanList = async (obj) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/loans-issued`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const postIssuedLoansExcel = async (obj) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/excel/loans-issued`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getIssuedLoansExcel = async (id) => {
  const url =
    process.env.REACT_APP_BASE_URL + `/report/excel/loans-issued/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
