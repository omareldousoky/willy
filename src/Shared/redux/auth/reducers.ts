import { getCookie } from '../../Services/getCookie'
import { parseJwt } from '../../Services/utils'
import { Auth } from './types'

export const authReducer = (
  state: Auth = { loading: true, validBranches: [] },
  action
) => {
  const token = getCookie('token')
  const tokenData = parseJwt(token)
  switch (action.type) {
    case 'ADD_AUTH_DATA':
      return {
        ...state,
        clientPermissions: JSON.parse(action.payload.clientPermissions),
        roles: action.payload.roles,
        validBranches: action.payload.validBranches,
        name: action.payload.name,
        loading: false,
        requireBranch: tokenData?.requireBranch,
      }
    default:
      return state
  }
}
