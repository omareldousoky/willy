import axios from '../../../../Shared/Services/axiosInstance'

export const approveManualOtherPayment = async (id: string) => {
  const url =
    process.env.REACT_APP_BASE_URL + `/loan/approve-manual-other-payment`
  try {
    const res = await axios.put(url, { id })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
