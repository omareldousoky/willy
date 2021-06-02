import axios from '../axios-instance'

export const uploadDocument = async (data: FormData) => {
  const url = process.env.REACT_APP_BASE_URL + `/application/document`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
