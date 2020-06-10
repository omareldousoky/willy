import {combineReducers} from 'redux';
import {branchReducer} from'./branches/reducers';
import {authReducer} from './auth/reducers';
import {searchReducer, searchFiltersReducer} from './search/reducers';
import {loadingReducer} from './loading/reducers';


const rootReducer = combineReducers({
    branch: branchReducer,
    auth: authReducer,
    search: searchReducer,
    loading: loadingReducer,
    searchFilters: searchFiltersReducer
})

export default rootReducer