import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const getProduct = async (productId: string) => {
  const url = API_BASE_URL + `/product/loan-product/${productId}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getProducts = async () => {
  const url = API_BASE_URL + '/product/loan-product'
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getDetailedProducts = async () => {
  const url = API_BASE_URL + '/product'
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
