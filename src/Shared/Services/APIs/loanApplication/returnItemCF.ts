import { API_BASE_URL } from 'Shared/envConfig'
import axios from 'Shared/Services/axiosInstance'

const returnItemUrl = `${API_BASE_URL}/application/return-cf-item`

export const returnItem = async (applicationId: string, truthDate: number) => {
  try {
    const res = await axios.put(`${returnItemUrl}/${applicationId}`, {
      truthDate,
    })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
