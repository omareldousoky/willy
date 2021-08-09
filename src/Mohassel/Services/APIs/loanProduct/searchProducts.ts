import { SearchRequest } from '../../../Models/common'
import axios from '../axios-instance'

const { REACT_APP_BASE_URL } = process.env

const searchProductsUrl = `${REACT_APP_BASE_URL}/search/product`
export const searchProducts = async (request: SearchRequest) => {
  try {
    const res = await axios.post(searchProductsUrl, request)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
