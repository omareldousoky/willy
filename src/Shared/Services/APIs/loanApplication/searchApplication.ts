import axios from '../../axiosInstance'

export const searchApplication = async (data: object) => {
  const url = process.env.REACT_APP_BASE_URL + `/search/application`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
