import { ApiResponse, Trace } from '../../../../Mohassel/Models/common'
import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

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
export interface BranchDetailsResponse extends Trace {
  data: BranchDetails
}

export const getBranch = async (
  _id: string
): Promise<ApiResponse<BranchDetailsResponse>> => {
  const url = API_BASE_URL + `/branch/${_id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
