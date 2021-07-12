import axios from '../axios-instance'

const { REACT_APP_BASE_URL } = process.env
const createProductUrl = `${REACT_APP_BASE_URL}/product/loan-product`
const editProductUrl = `${REACT_APP_BASE_URL}/product/loan-product`
const getProductApplicationsUrl = `${REACT_APP_BASE_URL}/report/product-applications`
export const createProduct = async (data: object) => {
  try {
    const res = await axios.post(createProductUrl, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const editProduct = async (id: string, data: object) => {
  try {
    const res = await axios.put(`${editProductUrl}/${id}`, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getProductApplications = async (productId: string) => {
  const params = { productId }
  try {
    const res = await axios.get(getProductApplicationsUrl, { params })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
