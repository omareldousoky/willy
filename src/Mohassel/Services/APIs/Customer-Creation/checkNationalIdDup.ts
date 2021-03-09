import axios from '../axios-instance'

export const checkNationalIdDuplicates = async (nationalId: string) => {
  const url =
    process.env.REACT_APP_BASE_URL +
    `/customer/checkNID?nationalId=${nationalId}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
