import axios from '../../../../Shared/Services/axiosInstance'

export const oracleIntegration = async () => {
  const url = process.env.REACT_APP_BASE_URL + `/oracle`
  try {
    const res = await axios.post(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
