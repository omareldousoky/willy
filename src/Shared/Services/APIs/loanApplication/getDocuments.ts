import axios from '../../axiosInstance'

export const getApplicationDocuments = async (applicationId: string) => {
  const url =
    process.env.REACT_APP_BASE_URL + `/application/${applicationId}/document`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
