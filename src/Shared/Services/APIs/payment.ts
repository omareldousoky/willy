import { API_BASE_URL } from '../../envConfig'
import axios from '../axiosInstance'

const baseUrl = `${API_BASE_URL}/loan`
const manualPaymentUrl = `${baseUrl}/manual-payment/:loanId`
const payFutureInstallmentUrl = `${baseUrl}/pay-future-installment/:loanId`
const payInstallmentUrl = `${baseUrl}/pay-installment/:loanId`
const approveManualPaymentUrl = `${baseUrl}/approve-manual-payment/:loanId`
const rejectManualPaymentUrl = `${baseUrl}/reject-manual-payment/:loanId`
const editManualOtherPaymentUrl = `${baseUrl}/edit-manual-other-payment/:loanId`
const otherPaymentUrl = `${baseUrl}/other-payment/:loanId`
const randomManualPaymentUrl = `${baseUrl}/manual-other-payment/:loanId`
const getOtherManualPaymentUrl = `${baseUrl}/get-manual-other-payments/:loanId`
const approveManualOtherPaymentUrl = `${baseUrl}/approve-manual-other-payment`
const rejectManualOtherPaymentUrl = `${baseUrl}/reject-manual-other-payment`
const earlyPaymentUrl = `${baseUrl}/early-payment/:loanId`
const editManualPaymentUrl = `${baseUrl}/edit-manual-payment/:loanId`

export const manualPayment = async (obj) => {
  try {
    const res = await axios.put(
      manualPaymentUrl.replace(':loanId', obj.id),
      obj
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const payFutureInstallment = async (obj) => {
  try {
    const res = await axios.put(
      payFutureInstallmentUrl.replace(':loanId', obj.id),
      obj
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const payInstallment = async (obj) => {
  try {
    const res = await axios.put(
      payInstallmentUrl.replace(':loanId', obj.id),
      obj
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const approveManualPayment = async (id: string) => {
  try {
    const res = await axios.put(approveManualPaymentUrl.replace(':loanId', id))
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const rejectManualPayment = async (id: string) => {
  try {
    const res = await axios.put(rejectManualPaymentUrl.replace(':loanId', id))
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const editManualOtherPayment = async (obj) => {
  try {
    const res = await axios.put(
      editManualOtherPaymentUrl.replace(':loanId', obj.id),
      obj
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const otherPayment = async ({ id, data }) => {
  try {
    const res = await axios.put(otherPaymentUrl.replace(':loanId', id), data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const randomManualPayment = async (obj) => {
  try {
    const res = await axios.put(
      randomManualPaymentUrl.replace(':loanId', obj.id),
      obj
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getManualOtherPayments = async (id) => {
  try {
    const res = await axios.get(getOtherManualPaymentUrl.replace(':loanId', id))

    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const approveManualOtherPayment = async (id: string) => {
  try {
    const res = await axios.put(approveManualOtherPaymentUrl, { id })

    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const rejectManualOtherPayment = async (id: string) => {
  try {
    const res = await axios.put(rejectManualOtherPaymentUrl, { id })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const earlyPayment = async (obj) => {
  try {
    const res = await axios.put(earlyPaymentUrl.replace(':loanId', obj.id), obj)
    return { status: 'success', body: res.data }
  } catch (error) {
    return {
      status: 'error',
      error: (error as Record<string, any>).response.data,
    }
  }
}

export const editManualPayment = async (obj) => {
  try {
    const res = await axios.put(
      editManualPaymentUrl.replace(':loanId', obj.id),
      obj
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
