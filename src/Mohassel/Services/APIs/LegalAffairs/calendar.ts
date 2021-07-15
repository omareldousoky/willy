import axios from '../axios-instance'

export const getCalendarEvents = async (data: {
  sessionFromDate: number
  sessionToDate: number
}) => {
  const url = process.env.REACT_APP_BASE_URL + `/search/legal-affairs-calendar`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
