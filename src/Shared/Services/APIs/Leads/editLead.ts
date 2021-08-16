import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'
import { Lead } from '../../../../Mohassel/Components/HalanIntegration/leadInterface'

export const editLead = async (obj: Lead) => {
  const url = API_BASE_URL + `/lead/edit-lead`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
