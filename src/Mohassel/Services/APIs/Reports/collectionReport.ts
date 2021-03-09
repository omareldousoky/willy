import axios from '../axios-instance'

export const collectionReport = async (data) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/collection-report`
  try {
    const res = await axios({
      method: 'POST',
      url,
      data,
    })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const postCollectionReportExcel = async (obj) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/excel/collection`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getCollectionReportExcel = async (id) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/excel/collection/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
