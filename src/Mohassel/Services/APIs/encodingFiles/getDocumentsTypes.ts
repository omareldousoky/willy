import axios from '../axios-instance'

export const getDocumentsTypes = async (
  type?: string,
  hidden?: boolean,
  customerType?: string
) => {
  const url = process.env.REACT_APP_BASE_URL + `/config/document-type`
  const params = { type, hidden, customerType }
  try {
    const res = await axios.get(url, { params })
    // const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
