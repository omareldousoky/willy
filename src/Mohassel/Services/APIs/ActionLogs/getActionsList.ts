import axios from '../../../../Shared/Services/axiosInstance'

export const getActionsList = async () => {
  const url = process.env.REACT_APP_BASE_URL + '/config/actions'
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
