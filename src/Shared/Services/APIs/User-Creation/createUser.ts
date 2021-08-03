import axios from '../../axiosInstance'

export const createUser = async (data: object) => {
  const url = process.env.REACT_APP_BASE_URL + '/user'
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
