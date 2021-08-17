import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const deleteDeathCertificate = async (data: object) => {
  const url = API_BASE_URL + '/customer/death-certificate'
  try {
    const res = await axios.delete(url, { data })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
