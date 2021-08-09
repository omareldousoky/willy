import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const reviewApplication = async (data: any) => {
  const url = API_BASE_URL + `/application/review/${data.id}`
  try {
    const res = await axios.put(url, { reviewedDate: data.date })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const undoreviewApplication = async (data: any) => {
  const url = API_BASE_URL + `/application/undo-review/${data.id}`
  try {
    const res = await axios.put(url, { reviewedDate: data.date })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const rejectApplication = async (data: any) => {
  const url = API_BASE_URL + `/application/bulk-reject`
  try {
    const res = await axios.put(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const cancelApplication = async (id: string) => {
  const url = API_BASE_URL + `/application/cancel/${id}`
  try {
    const res = await axios.put(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
