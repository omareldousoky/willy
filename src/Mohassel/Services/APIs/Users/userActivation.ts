import axios from '../axios-instance'

export const setUserActivation = async (data: any) => {
  const url = process.env.REACT_APP_BASE_URL + '/user/activation'
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
