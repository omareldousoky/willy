import axios from '../../../../Shared/Services/axiosInstance'

export const getManualOtherPayments = async (id: string) => {
  const url =
    process.env.REACT_APP_BASE_URL + `/loan/get-manual-other-payments/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
