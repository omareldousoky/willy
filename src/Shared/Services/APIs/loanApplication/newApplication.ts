import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const newApplication = async (data: object) => {
  const url = API_BASE_URL + `/application/assign`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const editApplication = async (data: object, id: string) => {
  const url = API_BASE_URL + `/application/edit/${id}`
  try {
    const res = await axios.put(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const newNanoApplication = async (data: object) => {
  const url = API_BASE_URL + `/application/create-nano`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
