import { SearchRequest } from '../../../../Shared/Models/common'
import axios from '../../../../Shared/Services/axiosInstance'
import { API_BASE_URL } from '../../../../Shared/envConfig'

const searchProductsUrl = `${API_BASE_URL}/search/product`
export const searchProducts = async (request: SearchRequest) => {
  try {
    const res = await axios.post(searchProductsUrl, request)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
