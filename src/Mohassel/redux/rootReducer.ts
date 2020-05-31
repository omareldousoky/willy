import {combineReducers} from 'redux'
import {branchReducer} from'./branches/reducers'



const rootReducer = combineReducers({
    branch: branchReducer,
})

export default rootReducer