import axios from '../axios-instance'

export const testPostponeHalfInstallment = async (
  applicationId: string,
  obj
) => {
  const url =
    process.env.REACT_APP_BASE_URL +
    `/loan/test-push-half-installment/${applicationId}`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const postponeHalfInstallment = async (applicationId: string, obj) => {
  const url =
    process.env.REACT_APP_BASE_URL +
    `/loan/push-half-installment/${applicationId}`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
