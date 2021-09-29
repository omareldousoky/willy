import { API_BASE_URL } from '../../../envConfig'
import { LeadCore } from '../../../Models/common'
import axios from '../../axiosInstance'

export const createLead = async (leadData: LeadCore) => {
  const url = API_BASE_URL + '/lead'
  try {
    const res = await axios.post(url, leadData)
    return { status: 'success', body: res.data }
  } catch (error: any) {
    return { status: 'error', error: error.response.data }
  }
}
