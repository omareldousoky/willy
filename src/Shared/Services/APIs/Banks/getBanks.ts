import { AxiosError } from 'axios'
import { API_BASE_URL } from '../../../envConfig'
import axiosInstance from '../../axiosInstance'
import { BanksResponse } from './types'

export const getBanks = () => {
  const url = `${API_BASE_URL}/config/banks`
  return axiosInstance
    .get<BanksResponse>(url)
    .then((data) => {
      return { status: 'success', body: data.data.banks, error: '' }
    })
    .catch((error) => {
      const serverError = error as AxiosError
      return { status: 'error', error: serverError.response?.data, body: [] }
    })
}
