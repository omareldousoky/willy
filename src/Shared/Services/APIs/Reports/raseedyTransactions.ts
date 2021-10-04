import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

interface RaseedyTransactionsRequestBody {
  startDate: number
  endDate: number
  branches: string[]
}

export const fetchRaseedyTransactions = async (
  requestBody: RaseedyTransactionsRequestBody
) => {
  const url = API_BASE_URL + '/report/raseedy-transactions'

  try {
    const res = await axios.post(url, requestBody)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const postRaseedyTransactionsExcel = async (obj) => {
  const url = API_BASE_URL + `/report/excel/raseedy-transactions`
  try {
    const res = await axios.post(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getRaseedyTransactionsExcel = async (id) => {
  const url = API_BASE_URL + `/report/excel/raseedy-transactions/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
