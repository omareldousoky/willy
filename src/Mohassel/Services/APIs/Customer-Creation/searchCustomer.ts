import axios from '../axios-instance'

export const searchCustomer = async (data: object) => {
  const url = process.env.REACT_APP_BASE_URL + `/search/customer`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
