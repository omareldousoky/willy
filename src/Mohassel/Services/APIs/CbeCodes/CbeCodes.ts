import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const searchCbeCode = async (data) => {
  const url = API_BASE_URL + `/search/cbe-code`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const postCbeCodesFile = async () => {
  const url = API_BASE_URL + `/customer/cbe-file`
  try {
    const res = await axios.post(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getCbeCodesFiles = async () => {
  const url = API_BASE_URL + `/customer/cbe-files`
  try {
    const res = await axios.get(url, { params: {} })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
