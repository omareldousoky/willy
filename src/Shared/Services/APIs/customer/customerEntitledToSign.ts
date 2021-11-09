import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const addEntitledToSignToCustomer = async (data: {
  customerId: string
  entitledToSignIds: Array<string>
}) => {
  const url = API_BASE_URL + `/customer/add-entitled-to-sign`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
