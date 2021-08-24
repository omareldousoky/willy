import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const changeLeadState = async (
  phoneNumber: string,
  newState: string,
  rejectionReason?: string,
  rejectionDetails?: string
) => {
  const url = API_BASE_URL + `/lead/review/${phoneNumber}`
  try {
    const res = await axios.put(url, {
      newStatus: newState,
      rejectionReason,
      rejectionDetails,
    })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const changeInReviewLeadState = async (
  phoneNumber: string,
  newState: string
) => {
  const url = API_BASE_URL + `/lead/change-in-review-status/${phoneNumber}`
  try {
    const res = await axios.put(url, { newStatus: newState })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
