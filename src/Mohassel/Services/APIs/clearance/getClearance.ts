import axios from '../axios-instance'

export const getClearance = async (id: string) => {
  const url = process.env.REACT_APP_BASE_URL + `/application/clearance/${id}`
  try {
    const res = await axios.post(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
