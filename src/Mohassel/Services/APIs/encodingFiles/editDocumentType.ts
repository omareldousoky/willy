import axios from '../axios-instance'

export const editDocumentsType = async (data: any) => {
  const url =
    process.env.REACT_APP_BASE_URL + `/config/document-type/${data.id}`
  try {
    const res = await axios.put(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
