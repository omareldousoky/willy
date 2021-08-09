import axios from '../../../../Shared/Services/axiosInstance'

export const cibTpayURL = async (fileKey: string) => {
  try {
    const { REACT_APP_BASE_URL } = process.env
    const url = `${REACT_APP_BASE_URL}/report/tpay-file?fileKey=${fileKey}`
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
