import { API_BASE_URL } from '../../../envConfig'
import { Lead } from '../../../Models/common'
import axios from '../../axiosInstance'

export const editLead = async (obj: Lead) => {
  const url = API_BASE_URL + `/lead/edit-lead`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
