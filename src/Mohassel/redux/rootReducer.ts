import {combineReducers} from 'redux';
import {branchReducer} from'./branches/reducers';
import {authReducer} from './auth/reducers';


const rootReducer = combineReducers({
    branch: branchReducer,
    auth: authReducer
})

export default rootReducer