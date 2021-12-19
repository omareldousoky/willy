import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

interface ChangeFundObj {
  fundSource: string
  applicationIds: Array<string>
  returnDetails: boolean
  approvalDate: number
}

interface ChangeFundObjCibPortofolio {
  sourceOfFund: string
  loanIds: Array<string>
}

export const changeSourceFund = async (data: ChangeFundObj) => {
  const url = API_BASE_URL + `/application/fund`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const changeSourceFundCibPortfolio = async (
  data: ChangeFundObjCibPortofolio
) => {
  const url = API_BASE_URL + `/loan/cib-portfolio-securitization`
  try {
    const res = await axios.put(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
