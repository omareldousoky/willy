import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const collectionReport = async (data) => {
  const url = API_BASE_URL + `/report/collection-report`
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

export const postCollectionReportExcel = async (obj) => {
  const url = API_BASE_URL + `/report/excel/collection`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getCollectionReportExcel = async (id) => {
  const url = API_BASE_URL + `/report/excel/collection/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
