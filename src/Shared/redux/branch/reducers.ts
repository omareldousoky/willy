import {
  BranchesActionTypes,
  CREATE_BRANCH,
  BranchState,
  GET_BRANCH,
  EDIT_BRANCH,
} from './types'

const branchInitialState: BranchState = {
  branch: {},
}

export function branchReducer(
  state = branchInitialState,
  action: BranchesActionTypes
) {
  switch (action.type) {
    case CREATE_BRANCH:
      return { ...state, ...action.payload }

    case GET_BRANCH: {
      return { ...state, ...action.payload }
    }
    case EDIT_BRANCH: {
      return { ...state, ...action.payload }
    }
    default:
      return state
  }
}
