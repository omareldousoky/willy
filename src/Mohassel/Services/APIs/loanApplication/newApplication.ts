import axios from '../axios-instance'

export const newApplication = async (data: object) => {
  const url = process.env.REACT_APP_BASE_URL + `/application/assign`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const editApplication = async (data: object, id: string) => {
  const url = process.env.REACT_APP_BASE_URL + `/application/edit/${id}`
  try {
    const res = await axios.put(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
