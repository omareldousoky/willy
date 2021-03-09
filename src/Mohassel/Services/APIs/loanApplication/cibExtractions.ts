import axios from '../axios-instance'

export const cibExtractions = async (batchDate: number) => {
  const url = process.env.REACT_APP_BASE_URL + `/application/cib-extractions`
  try {
    const res = await axios.post(url, { batchDate })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
