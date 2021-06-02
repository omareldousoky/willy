import axios from '../axios-instance'

export const getGroupMemberShares = async (id: string) => {
  const url = process.env.REACT_APP_BASE_URL + `/loan/customer-view/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
