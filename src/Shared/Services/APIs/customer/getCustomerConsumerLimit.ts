import axios from '../../axiosInstance'

export const getCustomerLimitFromMonthlyIncome = async (income: number) => {
  const url =
    process.env.REACT_APP_BASE_URL +
    `/customer/max-cf-limit?monthlyIncome=${income}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
