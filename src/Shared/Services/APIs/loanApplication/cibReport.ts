import { CIBReportRequest } from '../../../../Mohassel/Models/CIB'
import axios from '../../axiosInstance'

export const cibReport = async (request: CIBReportRequest) => {
  const url = `${process.env.REACT_APP_BASE_URL}/report/cib-screen`
  try {
    const res = await axios.post(url, request)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
