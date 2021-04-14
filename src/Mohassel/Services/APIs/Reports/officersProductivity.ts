import { AxiosResponse } from 'axios'
import { ApiResponse } from '../../../Models/common'
import { 
	CurrentHierarchiesResponse, 
	OfficersProductivityRequest, 
	OfficersProductivityResponse 
} from '../../../Models/OfficersProductivityReport'
import axios from '../axios-instance'

const { REACT_APP_BASE_URL } = process.env
const fetchOfficersProductivityUrl = `${REACT_APP_BASE_URL}/report/officer-productivity`
// for officers productivity input preparation
const fetchCurrentHierarchiesUrl = `${REACT_APP_BASE_URL}/branch/current-hierarchies`

export const fetchOfficersProductivityReport = async (
  request: OfficersProductivityRequest
): Promise<ApiResponse<OfficersProductivityResponse>> => {
  console.log(request)
  try {
    const res: AxiosResponse<OfficersProductivityResponse> = await axios.post(
      fetchOfficersProductivityUrl,
      request
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}

export const fetchCurrentHierarchies = async (): Promise<
  ApiResponse<CurrentHierarchiesResponse>
> => {
  try {
    const res: AxiosResponse<CurrentHierarchiesResponse> = await axios.post(
      fetchCurrentHierarchiesUrl
    )
    return { status: 'success', body: res.data }
  } catch (error) {
    return { status: 'error', error: error.response.data }
  }
}
