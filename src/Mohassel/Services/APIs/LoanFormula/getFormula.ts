import axios from '../../../../Shared/Services/axiosInstance'

export const getFormula = async (formulaId: string) => {
  const url =
    process.env.REACT_APP_BASE_URL + `/product/calculation-formula/${formulaId}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
