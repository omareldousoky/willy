import { CIBReportRequest } from '../../../Models/CIB'
import axios from '../axios-instance'

export const cibReport = async (request: CIBReportRequest) => {
  const url = `${process.env.REACT_APP_BASE_URL}/report/cib-screen`
  try {
    const res = await axios.post(url, request)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
