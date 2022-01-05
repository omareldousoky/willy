import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

interface ChangeFundObj {
  endDate: number
}

interface CibPortoReport {
  startDate: number
  endDate: number
  branches: string[]
}

export const cibPaymentReport = async (data: ChangeFundObj) => {
  const url = API_BASE_URL + `/report/cib-payments`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getTpayFiles = async () => {
  const url = API_BASE_URL + `/report/tpay-files`
  try {
    const res = await axios.get(url, { params: {} })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getCibPortoReports = async (data: CibPortoReport) => {
  const url = API_BASE_URL + `/report/excel/cib-portfolio-securitization`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getCibPortoFile = async (id: string) => {
  const url = API_BASE_URL + `/report/excel/cib-portfolio-securitization/${id}`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getCibPortoFiles = async () => {
  const url = API_BASE_URL + `/report/cib-portfolio-report-files/`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
