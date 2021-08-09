import axios from '../../../../Shared/Services/axiosInstance'

export const changeLeadBranch = async (
  phoneNumber: string,
  branchId: string,
  uuid: string
) => {
  const url =
    process.env.REACT_APP_BASE_URL + `/lead/lead-branch/${phoneNumber}`
  try {
    const res = await axios.put(url, { branchId, uuid })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
