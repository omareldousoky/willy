import axios from '../axios-instance'

export const createLoan = async (id: string, creationDate: number) => {
  const url = process.env.REACT_APP_BASE_URL + `/application/create/${id}`
  try {
    const res = await axios.put(url, { creationDate })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
