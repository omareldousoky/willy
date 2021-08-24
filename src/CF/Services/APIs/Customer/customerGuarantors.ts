import { CFGuarantorTableViewProp } from '../../../../Shared/Components/Profile/types'
import { API_BASE_URL } from '../../../../Shared/envConfig'
import axios from '../../../../Shared/Services/axiosInstance'

export const addGuarantorsToCustomer = async (
  data: CFGuarantorTableViewProp
) => {
  const url = API_BASE_URL + `/customer/add-guarantors`
  try {
    const res = await axios.post(url, data)
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
