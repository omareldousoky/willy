import { AxiosResponse } from 'axios'
import {
  ApiResponse,
  CurrentHierarchiesResponse,
  OfficerBranchPercentPaymentResponse,
  OfficerPercentPaymentResponse,
  OfficersBranchPercentPaymentRequest,
  OfficersPercentPaymentRequest,
  OfficersProductivityRequest,
  OfficersProductivityResponse,
} from '../../interfaces'
import axios from '../axios-instance'

const { REACT_APP_BASE_URL } = process.env
const fetchOfficerPercentPaymentUrl = `${REACT_APP_BASE_URL}/report/officer-percent-payment`
const fetchOfficerBranchPercentPaymentUrl = `${REACT_APP_BASE_URL}/report/officer-branch-percent-payment`
const fetchOfficersProductivityUrl = `${REACT_APP_BASE_URL}/report/officer-productivity`
// for officers productivity input preparation
const fetchCurrentHierarchiesUrl = `${REACT_APP_BASE_URL}/branch/current-hierarchies`

export const fetchOfficersPercentPaymentReport = async (
  request: OfficersPercentPaymentRequest
): Promise<ApiResponse<OfficerPercentPaymentResponse>> => {
  try {
    const res: AxiosResponse<OfficerPercentPaymentResponse> = await axios.post(
      fetchOfficerPercentPaymentUrl,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const fetchOfficersBranchPercentPaymentReport = async (
  request: OfficersBranchPercentPaymentRequest
): Promise<ApiResponse<OfficerBranchPercentPaymentResponse>> => {
  try {
    const res: AxiosResponse<OfficerBranchPercentPaymentResponse> = await axios.post(
      fetchOfficerBranchPercentPaymentUrl,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const fetchOfficersProductivityReport = async (
  request: OfficersProductivityRequest
): Promise<ApiResponse<OfficersProductivityResponse>> => {
  console.log(request)
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
