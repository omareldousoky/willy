import { API_BASE_URL } from '../../envConfig'
import axios from '../axiosInstance'

export const getIscore = async (data: object) => {
  const url = API_BASE_URL + `/iscore`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getIscoreCached = async (data: object) => {
  const url = API_BASE_URL + `/iscore/cached`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getSMEIscore = async (data: object) => {
  const url = API_BASE_URL + `/iscore/sme`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getSMECachedIscore = async (data: object) => {
  const url = API_BASE_URL + `/iscore/cached-sme`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
