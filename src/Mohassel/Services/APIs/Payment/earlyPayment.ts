import axios from '../../../../Shared/Services/axiosInstance'

export const earlyPayment = async (obj) => {
  const url = process.env.REACT_APP_BASE_URL + `/loan/early-payment/${obj.id}`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
