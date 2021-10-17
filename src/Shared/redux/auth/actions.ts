import Swal from 'sweetalert2'
import { authMe } from '../../Services/APIs/Auth/authMe'
import { getErrorMessage } from '../../Services/utils'
import local from '../../Assets/ar.json'

export const getAuthData = () => {
  return async (dispatch) => {
    const res = await authMe()
    if (res.status === 'success' && res.body.validBranches && res.body.roles) {
      dispatch({ type: 'ADD_AUTH_DATA', payload: res.body })
    } else {
      const error = res?.error?.error
        ? getErrorMessage(res.error.error)
        : local.noRoleOrBranchError
      Swal.fire(local.error, error, 'error')
    }
  }
}
