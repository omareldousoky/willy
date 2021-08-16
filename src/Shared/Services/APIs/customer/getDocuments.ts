import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

const getCustomerDocumentsUrl = `${API_BASE_URL}/customer/document`
const getNanoLimitDocumentUrl = `${API_BASE_URL}/customer/nano-loans-limit`

export const getCustomerDocuments = async (customerId: string) => {
  const params = { id: customerId }
  try {
    const res = await axios.get(getCustomerDocumentsUrl, { params })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getNanoLimitDocument = async (customerId: string) => {
  const params = { id: customerId }
  try {
    const res = await axios.get(getNanoLimitDocumentUrl, { params })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
