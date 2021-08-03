import axios from '../../axiosInstance'

export const createDocumentsType = async (data: any) => {
  const url = process.env.REACT_APP_BASE_URL + '/config/document-type'
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

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

export const getDocumentsTypes = async (
  type?: string,
  hidden?: boolean,
  customerType?: string
) => {
  const url = process.env.REACT_APP_BASE_URL + `/config/document-type`
  const params = { type, hidden, customerType }
  try {
    const res = await axios.get(url, { params })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
