import axios from '../../axiosInstance'
import { API_BASE_URL } from '../../../envConfig'
import {
  VendorLastSettlementDateRequest,
  VendorOutstandingSettlementsRequest,
  VendorSettlementRequest,
} from './types'

export const getVendorOutstandingSettlements = async ({
  merchantId,
  toDate,
}: VendorOutstandingSettlementsRequest) => {
  const searchProductsUrl = `${API_BASE_URL}/application/outstanding-settlement/${merchantId}?toDate=${toDate}`
  try {
    const res = await axios.post(searchProductsUrl)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getVendorLastSettlementDate = async ({
  merchantId,
}: VendorLastSettlementDateRequest) => {
  const searchProductsUrl = `${API_BASE_URL}/application/latest-settlement/${merchantId}`
  try {
    const res = await axios.post(searchProductsUrl)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const settleVendorOutstandingSettlements = async ({
  merchantId,
  settlementDate,
  settlementAmount,
  bankAccountNumber,
}: VendorSettlementRequest) => {
  const searchProductsUrl = `${API_BASE_URL}/application/merchant-settlement/${merchantId}?settlementDate=${settlementDate}&settlementAmount=${settlementAmount}&bankAccountNumber=${bankAccountNumber}`
  try {
    const res = await axios.post(searchProductsUrl)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
