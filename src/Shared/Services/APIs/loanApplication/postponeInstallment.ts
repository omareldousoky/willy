import axios from '../../axiosInstance'

export const testPostponeInstallment = async (applicationId: string, obj) => {
  const url =
    process.env.REACT_APP_BASE_URL +
    `/loan/test-push-installment/${applicationId}`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const postponeInstallment = async (applicationId: string, obj) => {
  const url =
    process.env.REACT_APP_BASE_URL + `/loan/push-installment/${applicationId}`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
