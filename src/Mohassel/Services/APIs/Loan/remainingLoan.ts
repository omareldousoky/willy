import axios from '../axios-instance'

export const remainingLoan = async (id: string) => {
  const url =
    process.env.REACT_APP_BASE_URL + `/loan/remaining-loan?customerId=${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
