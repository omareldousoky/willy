import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const setApplicationComments = async (
  applicationId: string,
  inReviewNotes: string[]
) => {
  const url = API_BASE_URL + `/application/assign-in-review-note`
  try {
    const res = await axios.put(url, { inReviewNotes, applicationId })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
