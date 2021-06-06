import axios from '../axios-instance'

interface ChangeFundObj {
  startDate: number
  endDate: number
}
export const cibReport = async (data: ChangeFundObj) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/cib-screen`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
