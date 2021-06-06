import axios from '../axios-instance'

export const editManualOtherPayment = async (obj) => {
  const url =
    process.env.REACT_APP_BASE_URL + `/loan/edit-manual-other-payment/${obj.id}`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
