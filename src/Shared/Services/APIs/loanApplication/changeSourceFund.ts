import axios from '../../axiosInstance'

interface ChangeFundObj {
  fundSource: string
  applicationIds: Array<string>
  returnDetails: boolean
  approvalDate: number
}
export const changeSourceFund = async (data: ChangeFundObj) => {
  const url = process.env.REACT_APP_BASE_URL + `/application/fund`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
