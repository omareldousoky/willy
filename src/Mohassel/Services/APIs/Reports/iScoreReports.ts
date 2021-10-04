import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const getiScoreReportRequests = async () => {
  const url = API_BASE_URL + `/report/iscore-files`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const generateiScoreReport = async (type: string) => {
  const url = API_BASE_URL + `/report/create-iscore-file`
  try {
    const res = await axios.post(url, { type })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getiScoreReport = async (id: string) => {
  const url = API_BASE_URL + `/report/download-iscore-file/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
