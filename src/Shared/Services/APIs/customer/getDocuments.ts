import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'
import { groupByKeyName } from '../../utils'

const getCustomerDocumentsUrl = `${API_BASE_URL}/customer/document`
const getNanoLimitDocumentUrl = `${API_BASE_URL}/customer/nano-loans-limit`

export const getCustomerDocuments = async (customerId: string) => {
  const params = { id: customerId }
  try {
    const res = await axios.get(getCustomerDocumentsUrl, { params })

    let responseData = res.data

    // TODO: Remove this workaround after BE fixes the duplicated document name bug
    if (responseData.docs) {
      const groupedDocs = groupByKeyName(responseData.docs, 'name')

      Object.keys(groupedDocs).forEach((key) => {
        const currDocs = groupedDocs[key].map((item) => item.docs)

        groupedDocs[key] = { name: key, docs: currDocs.flat() }
      })

      responseData = {
        docs: Object.values(groupedDocs),
      }
    }
    // End TODO

    return {
      status: 'success',
      body: responseData,
    }
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
