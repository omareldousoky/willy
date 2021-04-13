import { AxiosResponse } from 'axios'
import { ApiResponse } from '../../interfaces'
import axios from '../axios-instance'

interface FinancialClosingData {
  closeDate: number;
}
export interface FinancialClosingRequest {
  blockDate: number;
  branchesIds: string[];
}
interface FinancialUnBlockingRequest {
  branchesIds: string[];
}
interface BlockingSearchRequest {
  from: number;
  size: number;
  branchCode?: string;
  branchName?: string;
  status?: string;
  blockDate?: number;
  blockDateFilter?: string;
}
export interface ReviewFileResponse {
  _id: string;
  status: string;
  fileName: string;
  fileGeneratedAt: number;
  key: string;
  toDate: number;
}
export const financialClosing = async (data: FinancialClosingData) => {
  const url = process.env.REACT_APP_BASE_URL + '/application/financial-close'
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const financialBlocking = async (data: FinancialClosingRequest) => {
  const url = process.env.REACT_APP_BASE_URL + '/application/financial-block'
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const financialUnlBlocking = async (
  data: FinancialUnBlockingRequest
) => {
  const url = process.env.REACT_APP_BASE_URL + '/application/financial-unblock'
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const searchFinancialBlocking = async (data: BlockingSearchRequest) => {
  const url = process.env.REACT_APP_BASE_URL + '/search/financial-blocking'
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getOracleReviewFiles = async (): Promise<
  ApiResponse<ReviewFileResponse[]>> => {
  const url = process.env.REACT_APP_BASE_URL + '/oracle/review-files' 
  try {
    const res: AxiosResponse<ReviewFileResponse[]> = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const downloadOracleReviewFile = async(id: string): Promise<
ApiResponse<{presignedUrl: string}>> => {
const url = process.env.REACT_APP_BASE_URL + `/oracle/download-review-file/${id}`
try {
  const res: AxiosResponse<{presignedUrl: string}> = await axios.get(url)
  return { status: 'success', body: res.data }
} catch (error) {
  return { status: 'error', error: error.response.data }
}
}