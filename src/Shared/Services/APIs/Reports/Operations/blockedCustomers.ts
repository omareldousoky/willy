import axios from '../../../axiosInstance'
import { API_BASE_URL } from '../../../../envConfig'
import { BlockedCustomersRequest } from '../../../../Models/operationsReports'

const blockedCustomers = `${API_BASE_URL}/report/excel/blocked-customers`

export const postBlockedCustomers = async (
  request: BlockedCustomersRequest
) => {
  try {
    const res = await axios.post(blockedCustomers, request)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getBlockedCustomers = async (id: string) => {
  try {
    const res = await axios.get(`${blockedCustomers}/${id}`)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
