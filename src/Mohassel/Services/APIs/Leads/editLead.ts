import axios from '../axios-instance'
import { Lead } from '../../../Components/HalanIntegration/leadInterface'

export const editLead = async (obj: Lead) => {
  const url = process.env.REACT_APP_BASE_URL + `/lead/edit-lead`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
