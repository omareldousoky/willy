import axios from '../axios-instance'

interface RaseedyTransactionsRequestBody {
  startDate: number
  endDate: number
}

export const fetchRaseedyTransactions = async (
  requestBody: RaseedyTransactionsRequestBody
) => {
  const url = process.env.REACT_APP_BASE_URL + '/report/raseedy-transactions'

  try {
    const res = await axios.post(url, requestBody)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
