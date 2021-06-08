import axios from '../axios-instance'

export const writeOffLoan = async (id: any, obj: any) => {
  const url = process.env.REACT_APP_BASE_URL + `/loan/write-off/${id}`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
