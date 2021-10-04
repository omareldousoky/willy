import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const earlyPayment = async (obj) => {
  const url = API_BASE_URL + `/loan/early-payment/${obj.id}`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return {
      status: 'error',
      error: (error as Record<string, any>).response.data,
    }
  }
}
