import axios from '../axios-instance'

interface ChangeFundObj {
  endDate: number
}

export const cibPaymentReport = async (data: ChangeFundObj) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/cib-payments`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getTpayFiles = async () => {
  const url = process.env.REACT_APP_BASE_URL + `/report/tpay-files`
  try {
    const res = await axios.get(url, { params: {} })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
