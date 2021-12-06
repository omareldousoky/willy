import { useState } from 'react'
import Swal from 'sweetalert2'
import * as local from '../Assets/ar.json'
import { getErrorMessage } from '../Services/utils'

export default function useApi(apiCall, params) {
  const [data, setData] = useState([])
  const get = async () => {
    const res = await apiCall(params)
    if (res.status === 'success') {
      setData(res.body)
    } else {
      Swal.fire(local.error, getErrorMessage(res.error.error), 'error')
    }
  }

  const api: any = {
    get,
  }

  return [data, api]
}
