import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'
import { ConvictedReportRequest } from '../../../Components/ManageLegalAffairs/types'

export const getConvictedReport = async (reqBody: ConvictedReportRequest) => {
  const url = API_BASE_URL + '/report/convicted-clients'

  try {
    const res = await axios.post(url, reqBody)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
