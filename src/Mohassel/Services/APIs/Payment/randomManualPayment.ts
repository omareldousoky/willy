import axios from '../../../../Shared/Services/axiosInstance'

export const randomManualPayment = async (obj) => {
  const url =
    process.env.REACT_APP_BASE_URL + `/loan/manual-other-payment/${obj.id}`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
