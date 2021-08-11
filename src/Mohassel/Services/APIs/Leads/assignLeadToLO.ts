import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const assignLeadToLO = async (
  phoneNumber: string,
  loanOfficer: string,
  uuid: string
) => {
  const url = API_BASE_URL + `/lead/assign-lead-to-loan-officer/${phoneNumber}`
  try {
    const res = await axios.put(url, { loanOfficer, uuid })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
