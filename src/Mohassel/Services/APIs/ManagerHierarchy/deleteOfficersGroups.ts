import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const deleteOfficersGroups = async (data: object, id: string) => {
  const url = API_BASE_URL + `/branch/${id}/officers-group`
  try {
    const res = await axios.delete(url, { data })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
