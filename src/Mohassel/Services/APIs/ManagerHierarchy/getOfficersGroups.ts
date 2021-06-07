import axios from '../axios-instance'

export const getOfficersGroups = async (id: string) => {
  const url = process.env.REACT_APP_BASE_URL + `/branch/${id}/officers-groups`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
