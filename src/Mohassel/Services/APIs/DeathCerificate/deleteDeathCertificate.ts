import axios from '../axios-instance'

export const deleteDeathCertificate = async (data: object) => {
  const url = process.env.REACT_APP_BASE_URL + '/customer/death-certificate'
  try {
    const res = await axios.delete(url, { data })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
