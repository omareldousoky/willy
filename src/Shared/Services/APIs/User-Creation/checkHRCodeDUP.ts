import axios from '../axios-instance'

export const checkHRCodeDuplicates = async (hrCode: string, id?: string) => {
  const url =
    process.env.REACT_APP_BASE_URL +
    `/user/check-hr-code?hrCode=${hrCode}&userId=${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
