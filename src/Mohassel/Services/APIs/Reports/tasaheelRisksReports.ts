import axios from '../../../../Shared/Services/axiosInstance'

export const getAllTasaheelRisks = async () => {
  const url = process.env.REACT_APP_BASE_URL + `/report/tasaheel-risks`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getAllLoanAge = async () => {
  const url = process.env.REACT_APP_BASE_URL + `/report/debts-aging`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getAllMonthlyReport = async () => {
  const url = process.env.REACT_APP_BASE_URL + `/report/monthly-report-files`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getAllQuarterlyReport = async () => {
  const url = process.env.REACT_APP_BASE_URL + `/report/quarterly-report-files`
  try {
    const res = await axios.get(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const generateTasaheelRisksReport = async (date: { date: string }) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/tasaheel-risks`
  try {
    const res = await axios.post(url, date)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const generateLoanAgeReport = async (date: { date: string }) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/debts-aging`
  try {
    const res = await axios.post(url, date)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const generateMonthlyReport = async () => {
  const url = process.env.REACT_APP_BASE_URL + `/report/excel/monthly-report`
  try {
    const res = await axios.post(url)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const generateQuarterlyReport = async (quarter: { quarter: string }) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/excel/quarterly-report`
  try {
    const res = await axios.post(url, quarter)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getTasaheelRisksReport = async (id: string) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/tasaheel-risks`
  try {
    const res = await axios.get(url, { params: { id } })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getLoanAgeReport = async (id: string) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/debts-aging`
  try {
    const res = await axios.get(url, { params: { id } })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
export const getMonthlyReport = async (id: string) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/monthly-report`
  try {
    const res = await axios.get(url, { params: { fileKey: id } })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getQuarterlyReport = async (id: string) => {
  const url = process.env.REACT_APP_BASE_URL + `/report/quarterly-report`
  try {
    const res = await axios.get(url, { params: { fileKey: id } })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
