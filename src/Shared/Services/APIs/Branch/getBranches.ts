import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const getBranches = async () => {
  const url = API_BASE_URL + '/branch'
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getBranchesByProducts = async (data: object) => {
  const url = API_BASE_URL + `/branch/by-products`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getProductsByBranch = async (branchid: string) => {
  const url = API_BASE_URL + `/product/branch/${branchid}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
