import axios from '../../axiosInstance'

export const getCustomersBalances = async (data: object) => {
  const url = process.env.REACT_APP_BASE_URL + `/application/tracking`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
