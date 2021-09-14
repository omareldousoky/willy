import axios from '../../axiosInstance'
import { API_BASE_URL } from '../../../envConfig'

// TODO: move to model.ts
export interface ChangeClearancePrintStatusRequest {
  ids: Array<string>
}

export const changeClearancePrintStatus = async (
  data: ChangeClearancePrintStatusRequest
) => {
  const url = API_BASE_URL + `/application/change-clearance-print`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
