import axios from '../../../../Shared/Services/axiosInstance'

interface LoanIssuanceObj {
  id: string
  issueDate: number
  branchManagerId?: string
  managerVisitDate?: number
}
export const issueLoan = async (obj: LoanIssuanceObj) => {
  const url = process.env.REACT_APP_BASE_URL + `/application/issue/${obj.id}`
  try {
    const res = await axios.put(url, obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
