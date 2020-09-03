import {combineReducers} from 'redux';
import {branchReducer} from'./branch/reducers';
import {authReducer} from './auth/reducers';
import {searchReducer, searchFiltersReducer} from './search/reducers';
import {loadingReducer} from './loading/reducers';
import { paymentReducer } from './payment/reducers';
import {
    DocumentReducer,
    DocumentsReducer,
} from './document/reducers';

const rootReducer = combineReducers({
    branch: branchReducer,
    auth: authReducer,
    search: searchReducer,
    loading: loadingReducer,
    searchFilters: searchFiltersReducer,
    payment: paymentReducer,
    document: DocumentReducer,
    documents: DocumentsReducer,
})

export default rootReducer