import axios from '../axios-instance'

export const editBranch = async (data: object, _id: string) => {
  const url = process.env.REACT_APP_BASE_URL + `/branch/${_id}`
  try {
    const res = await axios.put(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
