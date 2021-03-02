import axios from '../axios-instance'

export const getIscore = async (data: object) => {
  const url = process.env.REACT_APP_BASE_URL + `/iscore`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getIscoreCached = async (data: object) => {
  const url = process.env.REACT_APP_BASE_URL + `/iscore/cached`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
