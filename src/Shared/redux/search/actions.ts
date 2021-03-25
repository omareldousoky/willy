import { searchCustomer, searchCompany } from '../../../Mohassel/Services/APIs/Customer-Creation/searchCustomer';
import { searchBranches } from '../../../Mohassel/Services/APIs/Branch/searchBranches';
import { searchUsers } from '../../../Mohassel/Services/APIs/Users/searchUsers';
import { searchLoan } from '../../../Mohassel/Services/APIs/Loan/searchLoan';
import { searchApplication } from '../../../Mohassel/Services/APIs/loanApplication/searchApplication';
import {searchActionLogs} from '../../../Mohassel/Services/APIs/ActionLogs/searchActionLogs';
import { searchLeads } from '../../../Mohassel/Services/APIs/Leads/searchLeads';
import {searchClearance} from '../../../Mohassel/Services/APIs/clearance/searchClearance'
import { searchGroups } from '../../../Mohassel/Services/APIs/ManagerHierarchy/searchGroups';
import { searchLoanOfficer } from '../../../Mohassel/Services/APIs/LoanOfficers/searchLoanOfficer';
export const search = (obj) => {
    switch (obj.url) {
        case ('customer'):
            return async (dispatch) => {
                delete obj.url;
                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await searchCustomer(obj);
                if (res.status === "success") {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: {...res.body, status: res.status , error: undefined}})
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: {...res.error , status: res.status}})   
                }
            }
            case ('company'):
                return async (dispatch) => {
                    delete obj.url;
                    dispatch({ type: 'SET_LOADING', payload: true })
                    const res = await searchCompany(obj);
                    if (res.status === "success") {
                        dispatch({ type: 'SET_LOADING', payload: false })
                        dispatch({ type: 'SEARCH', payload: {...res.body, status: res.status , error: undefined}})
                    } else {
                        dispatch({ type: 'SET_LOADING', payload: false })
                        dispatch({ type: 'SEARCH', payload: {...res.error , status: res.status}})   
                    }
                }
        case ('branch'):
            return async (dispatch) => {
                delete obj.url;
                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await searchBranches(obj);
                if (res.status === "success") {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: {...res.body, status: res.status , error: undefined}})
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: {...res.error , status: res.status}})   
                }
            }
        case ('user'):
            return async (dispatch) => {
                delete obj.url;
                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await searchUsers(obj);
                if (res.status === "success") {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: {...res.body, status: res.status , error: undefined}})
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: {...res.error , status: res.status}})   
                }
            }
        case ('loan'):
            return async (dispatch) => {
                delete obj.url;
                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await searchLoan(obj);
                if (res.status === "success") {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: {...res.body, status: res.status , error: undefined}})
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: {...res.error , status: res.status}})   
                }
            }
        case ('application'):
            return async (dispatch) => {
                delete obj.url;
                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await searchApplication(obj);
                if (res.status === "success") {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: {...res.body, status: res.status , error: undefined}})
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: {...res.error , status: res.status}})   
                }
            }
        case ('actionLogs'):
            return async (dispatch) => {
                delete obj.url;
                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await searchActionLogs(obj);
                if (res.status === "success") {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: {...res.body, status: res.status , error: undefined}})
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: {...res.error , status: res.status}})   
                }
            }
        case ('lead'):
            return async (dispatch) => {
                delete obj.url;
                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await searchLeads(obj);
                if (res.status === "success") {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: {...res.body, status: res.status , error: undefined}})
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: {...res.error , status: res.status}})   
                }
            }
         case('clearance'):
            return async (dispatch) => {
                delete obj.url;
                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await searchClearance(obj);
                if (res.status === 'success') {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: { ...res.body, status: res.status, error: undefined } })
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: { ...res.error, status: res.status } })
                }
            }
         case ('supervisionsGroups'):
             return async (dispatch)=>{
                    delete obj.url;
                    dispatch({ type: 'SET_LOADING', payload: true })
                    const res = await searchGroups(obj);
                    if (res.status === 'success') {
                        dispatch({ type: 'SET_LOADING', payload: false })
                        dispatch({ type: 'SEARCH', payload: { ...res.body, status: res.status, error: undefined } })
                    } else {
                        dispatch({ type: 'SET_LOADING', payload: false })
                        dispatch({ type: 'SEARCH', payload: { ...res.error, status: res.status } })
                    }  
             }
        case('loanOfficer'):
        return async (dispatch) => {
            delete obj.url;
            dispatch({ type: 'SET_LOADING', payload: true })
            const res = await searchLoanOfficer(obj);
            if (res.status === "success") {
                dispatch({ type: 'SET_LOADING', payload: false })
                dispatch({ type: 'SEARCH', payload: {...res.body, status: res.status , error: undefined}})
            } else {
                dispatch({ type: 'SET_LOADING', payload: false })
                dispatch({ type: 'SEARCH', payload: {...res.error , status: res.status}})   
            }
        }        
        case ('clearData'):
            return (dispatch) => {
                dispatch({ type: 'CLEAR_DATA', payload: {} })
            }
        default: return null;
    }
}

export const searchFilters = (obj) => {
    return (dispatch) => {
        if (Object.keys(obj).length === 0)
            dispatch({ type: 'RESET_SEARCH_FILTERS', payload: obj })
        else
            dispatch({ type: 'SET_SEARCH_FILTERS', payload: obj })
    }
}

export const issuedLoansSearchFilters = (obj) => {
    return (dispatch) => {
        if (Object.keys(obj).length === 0)
            dispatch({ type: 'RESET_ISSUED_LOANS_SEARCH_FILTERS', payload: obj })
        else
            dispatch({ type: 'SET_ISSUED_LOANS_SEARCH_FILTERS', payload: obj })
    }
}