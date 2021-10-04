import { SearchRequest } from '../../../Models/common'
import axios from '../../axiosInstance'
import { API_BASE_URL } from '../../../envConfig'

const searchProductsUrl = `${API_BASE_URL}/search/product`
export const getVendorUnpaidSettlements = async (request: SearchRequest) => {
  try {
    const res = await axios.post(searchProductsUrl, request)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
