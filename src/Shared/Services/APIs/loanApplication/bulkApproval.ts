import axios from '../../axiosInstance'

export const bulkApproval = async (data: object) => {
  const url = process.env.REACT_APP_BASE_URL + `/application/bulk-approve`
  try {
    const res = await axios.put(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
