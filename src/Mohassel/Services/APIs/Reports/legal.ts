import axios from '../axios-instance'
import { ConvictedReportRequest } from '../../../Components/ManageLegalAffairs/types'

export const getConvictedReport = async (reqBody: ConvictedReportRequest) => {
  const url = process.env.REACT_APP_BASE_URL + '/report/convicted-clients'

  try {
    const res = await axios.post(url, reqBody)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
