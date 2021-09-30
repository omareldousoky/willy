import { API_BASE_URL } from '../../../../envConfig'
import axios from '../../../axiosInstance'

export const writeOffs = async (data) => {
  const url = API_BASE_URL + `/report/write-offs`
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
export const postWriteOffsExcel = async (obj) => {
  const url = API_BASE_URL + `/report/excel/write-offs`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getWriteOffsExcel = async (id) => {
  const url = API_BASE_URL + `/report/excel/write-offs/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
