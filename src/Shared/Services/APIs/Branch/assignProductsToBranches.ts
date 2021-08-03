import axios from '../../axiosInstance'

export const assignProductsToBranches = async (data: object) => {
  const url = process.env.REACT_APP_BASE_URL + `/branch/assign-to-product-bulk`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const unassignProductsToBranches = async (data: object) => {
  const url =
    process.env.REACT_APP_BASE_URL + `/branch/unassign-to-product-bulk`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
