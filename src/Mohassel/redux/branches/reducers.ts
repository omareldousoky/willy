import {
    BranchesState,
    BranchesActionTypes,
    CREATE_BRANCH,

} from './types';


const initialState: BranchesState = {
    branches: []
}

export function branchReducer(
    state = {},
    action: BranchesActionTypes
) {
    switch(action.type) {
        case CREATE_BRANCH:
         return {}
        default: 
        return state
    }

}