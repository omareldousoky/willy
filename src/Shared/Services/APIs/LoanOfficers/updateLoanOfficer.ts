import axios from '../../axiosInstance'

export const updateLoanOfficer = async (data: object) => {
  const url = process.env.REACT_APP_BASE_URL + '/user/change-officer-data'
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
