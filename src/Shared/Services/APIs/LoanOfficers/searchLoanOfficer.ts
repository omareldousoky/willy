import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

interface SearchLOAndManager {
  branchId: string
  size: number
  from: number
  name: string
}
export const searchLoanOfficer = async (data: object) => {
  const url = API_BASE_URL + `/search/loan-officer`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const searchLoanOfficerLogs = async (data: object) => {
  const url = API_BASE_URL + `/search/customer-officer-log`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getLoanOfficer = async (id: string) => {
  const url = API_BASE_URL + `/user/loan-officer?id=${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const searchLoanOfficerAndManager = async (data: SearchLOAndManager) => {
  const url =
    API_BASE_URL +
    `/search/branch-employees/${data.branchId}?size=${data.size}&from=${data.from}&name=${data.name}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
