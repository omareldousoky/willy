import Swal from 'sweetalert2'
import { authMe } from '../../Services/APIs/Auth/authMe'
import { getErrorMessage } from '../../Services/utils'

export const getAuthData = () => {
  return async (dispatch) => {
    const res = await authMe()
    if (res.status === 'success') {
      dispatch({ type: 'ADD_AUTH_DATA', payload: res.body })
    } else Swal.fire('Error !', getErrorMessage(res.error.error), 'error')
  }
}
