import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const getPermissions = async (id: string) => {
  const url = API_BASE_URL + `/user/role/actions?id=${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getRoles = async () => {
  const url = API_BASE_URL + `/user/role`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const createRole = async (data: object) => {
  const url = API_BASE_URL + `/user/role`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const editRole = async (data: object) => {
  const url = API_BASE_URL + `/user/role/permissions`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getUserCountPerRole = async (id: string) => {
  const url = API_BASE_URL + `/user/role/count?id=${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
