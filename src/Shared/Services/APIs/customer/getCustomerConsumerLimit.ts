import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

export const getCustomerLimitFromMonthlyIncome = async (income: number) => {
  const url = API_BASE_URL + `/customer/cf-limit`
  const params = { monthlyIncome: income }
  try {
    const res = await axios.get(url, { params })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const approveCustomerCFLimit = async (_id: string) => {
  const url = API_BASE_URL + `/customer/approve-cf-limit/${_id}`
  try {
    const res = await axios.post(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
