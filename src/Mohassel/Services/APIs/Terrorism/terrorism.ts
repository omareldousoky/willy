import { AxiosResponse } from 'axios'
import {
  TerroristResponse,
  TerroristUnResponse,
} from '../../../../Shared/Services/interfaces'
import { ApiResponse } from '../../../Models/common'
import axios from '../../../../Shared/Services/axiosInstance'
import { API_BASE_URL } from '../../../../Shared/envConfig'

const fetchSearchLocalTerroristUrl = `${API_BASE_URL}/search/local-terrorist`
const fetchSearchUniTerroristUrl = `${API_BASE_URL}/search/UN-terrorist`
interface SearchTerroristRequest {
  size: number
  from: number
  order: string
  fromDate: number
  toDate: number
  name: number
}

export const searchTerrorists = async (
  request: SearchTerroristRequest
): Promise<ApiResponse<TerroristResponse[]>> => {
  try {
    const res: AxiosResponse<TerroristResponse[]> = await axios.post(
      fetchSearchLocalTerroristUrl,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const searchUnTerrorists = async (
  request: SearchTerroristRequest
): Promise<ApiResponse<TerroristUnResponse[]>> => {
  try {
    const res: AxiosResponse<TerroristUnResponse[]> = await axios.post(
      fetchSearchUniTerroristUrl,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const uploadTerroristDocument = async (data: FormData) => {
  const url = `${API_BASE_URL}/customer/local-terrorists-document`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const uploadTerroristUnDocument = async (data: FormData) => {
  const url = `${API_BASE_URL}/customer/UN-terrorists-document`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const downloadSuspectsReport = async () => {
  const url = `${API_BASE_URL}/report/suspected-customers`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
