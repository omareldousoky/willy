import axios from '../../../../Shared/Services/axiosInstance'

export const guaranteed = async (guarantorId: string) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/guaranteed`
  try {
    const res = await axios({
      method: 'POST',
      url,
      data: { guarantorId },
    })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
