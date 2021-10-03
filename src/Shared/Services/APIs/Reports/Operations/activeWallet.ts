import { AxiosResponse } from 'axios'
import axios from '../../../axiosInstance'
import { API_BASE_URL } from '../../../../envConfig'
import { ApiResponse } from '../../../../Models/common'

const fetchActiveWalletIndividualUrl = `${API_BASE_URL}/report/individual-active-wallets`
const fetchActiveWalletGroupUrl = `${API_BASE_URL}/report/group-active-wallets`

export interface ActiveWalletRequest {
  date: string
  branches?: Array<string>
  loanOfficerIds?: Array<string>
}

export interface ActiveWalletIndividualResponse {
  response: {
    branchName: string
    totalLoanCount: number
    totalPrincipal: number
    customersCount: number
    totalCreditInstallmentCount: number
    totalCreditInstallmentAmount: number
    totalLateInstallmentCount: number
    totalLateInstallmentAmount: number
    officers: {
      officerName: string
      customersCount: number
      totalCreditInstallmentAmount: number
      totalCreditInstallmentCount: number
      totalLateInstallmentAmount: number
      totalLateInstallmentCount: number
      totalLoanCount: number
      totalPrincipal: number
      areas: {
        areaName: string
        customersCount: string
        totalCreditInstallmentAmount: number
        totalCreditInstallmentCount: number
        totalLateInstallmentAmount: number
        totalLateInstallmentCount: number
        totalLoanCount: number
        totalPrincipal: number
        data: {
          phoneNumber: string
          homePhoneNumber: string
          workArea: string
          address: string
          activity: string
          creditAmount: number
          creditCount: number
          firstLateDate: string
          latestPaymentDate: string
          lateAmount: number
          lateCount: number
          principal: number
          loanDate: string
          customerName: string
          customerCode: number
          sector: string
        }[]
      }[]
    }[]
  }[]
}
export interface ActiveWalletGroupResponse {
  response: {
    totalGroups: number
    totalPrincipal: number
    membersCount: number
    creditLoanCount: number
    creditLoanPrincipal: number
    latePaymentsCount: number
    latePaymentsAmount: number
    branchName: string
    officers: {
      loanOfficerName: string
      totalGroups: number
      totalPrincipal: number
      membersCount: number
      creditLoanCount: number
      creditLoanPrincipal: number
      latePaymentsCount: number
      latePaymentsAmount: number
      areas: {
        areaName: string
        totalGroups: number
        totalPrincipal: number
        membersCount: number
        creditLoanCount: number
        creditLoanPrincipal: number
        latePaymentsCount: number
        latePaymentsAmount: number
        groups: {
          leaderName: string
          issueDate: string
          installmentsCount: number
          principal: number
          creditCount: number
          creditAmount: number
          lateCount: number
          lateAmount: number
          latestPaymentDate: string
          lateDate: string
          members: {
            customerCode: string
            customerName: string
            businessActivity: string
            principal: number
            address: string
            type: string
            phoneNumber: string
            homePhoneNumber: string
            businessSector: string
          }[]
        }[]
      }[]
    }[]
  }[]
}

export const fetchActiveWalletIndividualReport = async (
  request: ActiveWalletRequest
): Promise<ApiResponse<ActiveWalletIndividualResponse>> => {
  try {
    const res: AxiosResponse<ActiveWalletIndividualResponse> = await axios.post(
      fetchActiveWalletIndividualUrl,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const fetchActiveWalletGroupReport = async (
  request: ActiveWalletRequest
): Promise<ApiResponse<ActiveWalletGroupResponse>> => {
  try {
    const res: AxiosResponse<ActiveWalletGroupResponse> = await axios.post(
      fetchActiveWalletGroupUrl,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
