import axios from "axios"
import { ConvictedReportReqBody } from "../../../Components/ManageLegalAffairs/types"

export const getConvictedReport = async (reqBody: ConvictedReportReqBody) => {
  const url = process.env.REACT_APP_BASE_URL + '/report/convicted-clients'

  try {
    const res = await axios.post(url, reqBody)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
