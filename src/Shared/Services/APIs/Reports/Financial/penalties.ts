import { API_BASE_URL } from '../../../../envConfig'
import axios from '../../../axiosInstance'

export const penalties = async (data) => {
  const url = API_BASE_URL + `/report/penalties`
  try {
    const res = await axios({
      method: 'POST',
      url,
      data,
    })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const postPenaltiesExcel = async (obj) => {
  const url = API_BASE_URL + `/report/excel/penalties`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getPenaltiesExcel = async (id) => {
  const url = API_BASE_URL + `/report/excel/penalties/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
