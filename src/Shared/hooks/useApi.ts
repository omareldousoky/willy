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
      Swal.fire({
        title: local.error,
        confirmButtonText: local.confirmationText,
        text: getErrorMessage(res.error.error),
        icon: 'error',
      })
    }
  }

  const api: any = {
    get,
  }

  return [data, api]
}
