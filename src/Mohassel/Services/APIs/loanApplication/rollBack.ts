import axios from '../axios-instance'

export const getRollableActionsById = async (applicationId: string) => {
  const url =
    process.env.REACT_APP_BASE_URL +
    `/loan/available-rollbacks/${applicationId}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const rollbackActionByID = async (
  data: object,
  applicationId: string
) => {
  const url =
    process.env.REACT_APP_BASE_URL + `/loan/rollback-action/${applicationId}`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
