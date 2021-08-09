import axios from '../../../../Shared/Services/axiosInstance'

export const rejectManualPayment = async (id: string) => {
  const url =
    process.env.REACT_APP_BASE_URL + `/loan/reject-manual-payment/${id}`
  try {
    const res = await axios.put(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
