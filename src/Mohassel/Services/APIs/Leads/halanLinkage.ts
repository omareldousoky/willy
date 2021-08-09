import { AxiosResponse } from 'axios'
import {
  ApiResponse,
  CheckLinkageResponse,
  ConfirmLinkageRequest,
} from '../../interfaces'
import axios from '../../../../Shared/Services/axiosInstance'

const { REACT_APP_BASE_URL } = process.env
const checkLinkageUrl = `${REACT_APP_BASE_URL}/lead/check-linkage/:customerId`
const confirmLinkageUrl = `${REACT_APP_BASE_URL}/lead/confirm-linkage`
const removeLinkageUrl = `${REACT_APP_BASE_URL}/lead/remove-linkage`

export const checkLinkage = async (
  customerId: string
): Promise<ApiResponse<CheckLinkageResponse>> => {
  try {
    const res: AxiosResponse<CheckLinkageResponse> = await axios.get(
      checkLinkageUrl.replace(':customerId', customerId)
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const confirmLinkage = async (
  request: ConfirmLinkageRequest
): Promise<ApiResponse<unknown>> => {
  try {
    const res: AxiosResponse<unknown> = await axios.post(
      confirmLinkageUrl,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const removeLinkage = async (
  customerId: string
): Promise<ApiResponse<unknown>> => {
  try {
    const res: AxiosResponse<unknown> = await axios.post(removeLinkageUrl, {
      customerId,
    })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
