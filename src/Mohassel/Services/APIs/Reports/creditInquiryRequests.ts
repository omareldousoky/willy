import axios from '../../../../Shared/Services/axiosInstance'

const creditInquiryRequestsURL = `${process.env.REACT_APP_BASE_URL}/report/excel/iscore-report`

export const postCreditInquiryExcel = async (requestModel: {
  startDate: number
  endDate: number
  branch: '5fdcd7ea0074db7d6d0777d0'
  status: 'not_associated'
}) => {
  try {
    const res = await axios.post(creditInquiryRequestsURL, requestModel)

    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const getCreditInquiryExcel = async (id: string) => {
  try {
    const url = `${creditInquiryRequestsURL}/${id}`
    const res = await axios.get(url)

    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
