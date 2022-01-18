import { AxiosResponse, AxiosError } from 'axios'
import { CommentsReportResponse } from 'Shared/Models/operationsReports'
import axios from '../../../axiosInstance'
import { API_BASE_URL } from '../../../../envConfig'
import { ApiResponse } from '../../../../Models/common'

export const postCommentsReport = async (applicationKey: string) => {
  const url = API_BASE_URL + `/report/loan-applications-notes/`
  try {
    const res = await axios({
      method: 'POST',
      url,
      data: { applicationKey },
    })
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
