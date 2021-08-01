import { ApiResponse } from '../../../Models/common'
import {
  LegalWarningRequest,
  LegalWarningResponse,
  LegalWarningsSearchRequest,
  LegalWarningsSearchResponse,
} from '../../../Models/LegalAffairs'
import axios from '../axios-instance'

const baseUrl = process.env.REACT_APP_BASE_URL
const legalService = `${baseUrl}/legal`

const fetchWarningUrl = `${legalService}/get-warning`
const createWarningUrl = `${legalService}/warning`
const setPrintWarningFlagUrl = `${legalService}/print-warning`
const searchWarningsUrl = `${baseUrl}/search/legal-warnings`

export const fetchWarning = async (
  request: LegalWarningRequest
): Promise<ApiResponse<LegalWarningResponse>> => {
  try {
    const res = await axios.post(fetchWarningUrl, request)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const createWarning = async (
  request: LegalWarningRequest
): Promise<ApiResponse<string>> => {
  try {
    const res = await axios.post(createWarningUrl, request)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const setPrintWarningFlag = async (warningsIds: string[]) => {
  try {
    const res = await axios.post(setPrintWarningFlagUrl, { ids: warningsIds })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const searchWarnings = async (
  request: LegalWarningsSearchRequest
): Promise<ApiResponse<LegalWarningsSearchResponse>> => {
  try {
    const res = await axios.post(searchWarningsUrl, request)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
