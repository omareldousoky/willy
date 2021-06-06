import axios from '../axios-instance'

export const createOfficersGroups = async (data: object) => {
  const url = process.env.REACT_APP_BASE_URL + '/branch/create-officers-group'
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
