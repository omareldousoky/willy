import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const getFormula = async (formulaId: string) => {
  const url = API_BASE_URL + `/product/calculation-formula/${formulaId}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
