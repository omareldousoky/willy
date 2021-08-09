import { API_BASE_URL } from '../../../envConfig'
import axios from '../../axiosInstance'

// TODO: move to model
interface CustomerCategorizationRequest {
  customerId: string
}
export interface CustomerScore {
  loanApplicationKey: number
  customerScore: number
}
export interface CustomerCategorizationResponse {
  customerScores: Array<CustomerScore>
}
const customerCategorizationUrl = `${API_BASE_URL}/customer/categorization/:customerId`

export const getCustomerCategorization = async (
  request: CustomerCategorizationRequest
) => {
  try {
    const res = await axios.get(
      customerCategorizationUrl.replace(':customerId', request.customerId)
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
