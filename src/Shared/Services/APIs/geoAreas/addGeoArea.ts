import axios from '../../axiosInstance'

export const addGeoArea = async (obj: any) => {
  const url = process.env.REACT_APP_BASE_URL + '/config/geo-areas'
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
