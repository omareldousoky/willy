import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

const documentTypeUrl = `${API_BASE_URL}/config/document-type`

export const createDocumentsType = async (data: any) => {
  try {
    const res = await axios.post(documentTypeUrl, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const editDocumentsType = async (data: any) => {
  try {
    const res = await axios.put(`${documentTypeUrl}/${data.id}`, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getDocumentsTypes = async (
  type?: string,
  hidden?: boolean,
  customerType?: string
) => {
  const params = { type, hidden, customerType }
  try {
    const res = await axios.get(documentTypeUrl, { params })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
