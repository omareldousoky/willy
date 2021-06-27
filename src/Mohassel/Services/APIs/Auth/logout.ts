import axios from '../axios-instance'

export const logout = async () => {
  const url = process.env.REACT_APP_BASE_URL + '/auth/logout'
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
