import { Trace } from '../../../../Shared/Services/interfaces'
import axios from '../axios-instance'
import { ApiResponse } from '../Reports/unpaidInstallmentsPerArea'

export interface BranchDetails {
  branchCode: number
  _id: string
  name?: string
  address?: string
  longitude?: number
  latitude?: number
  phoneNumber?: string
  faxNumber?: string
  governorate?: string
  status: string
  postalCode?: string
  bankAccount?: string
  costCenter?: string
  licenseDate?: number
  licenseNumber?: string
}
interface BranchDetailsResponse extends Trace {
  data: BranchDetails
}

export const getBranch = async (
  _id: string
): Promise<ApiResponse<BranchDetailsResponse>> => {
  const url = process.env.REACT_APP_BASE_URL + `/branch/${_id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
