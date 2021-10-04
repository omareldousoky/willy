import { AxiosResponse } from 'axios'
import {
  OfficersProductivityRequest,
  OfficersProductivityResponse,
} from '../../../Models/OfficersProductivityReport'
import axios from '../../../../Shared/Services/axiosInstance'
import { API_BASE_URL } from '../../../../Shared/envConfig'
import { ApiResponse } from '../../../../Shared/Models/common'
import { CurrentHierarchiesResponse } from '../../../../Shared/Models/OfficerProductivity/OfficerProductivityReport'

const fetchOfficersProductivityUrl = `${API_BASE_URL}/report/officer-productivity`
// for officers productivity input preparation
const fetchCurrentHierarchiesUrl = `${API_BASE_URL}/branch/current-hierarchies`

export const fetchOfficersProductivityReport = async (
  request: OfficersProductivityRequest
): Promise<ApiResponse<OfficersProductivityResponse>> => {
  try {
    const res: AxiosResponse<OfficersProductivityResponse> = await axios.post(
      fetchOfficersProductivityUrl,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getOfficersProductivityReportById = async (
  id: string
): Promise<ApiResponse<OfficersProductivityResponse>> => {
  try {
    const res: AxiosResponse<OfficersProductivityResponse> = await axios.get(
      fetchOfficersProductivityUrl + `/${id}`
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getOfficersProductivityReports = async () => {
  try {
    const res: AxiosResponse = await axios.get(fetchOfficersProductivityUrl)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const fetchCurrentHierarchies = async (): Promise<
  ApiResponse<CurrentHierarchiesResponse>
> => {
  try {
    const res: AxiosResponse<CurrentHierarchiesResponse> = await axios.post(
      fetchCurrentHierarchiesUrl
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
