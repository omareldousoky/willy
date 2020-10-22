import { searchCustomer } from '../../Services/APIs/Customer-Creation/searchCustomer';
import { searchBranches } from '../../Services/APIs/Branch/searchBranches';
import { searchUsers } from '../../Services/APIs/Users/searchUsers';
import { searchLoan } from '../../Services/APIs/Loan/searchLoan';
import { searchApplication } from '../../Services/APIs/loanApplication/searchApplication';
import { searchActionLogs } from '../../Services/APIs/ActionLogs/searchActionLogs';
import { searchLeads } from '../../Services/APIs/Leads/searchLeads';

export const search = (obj) => {
    switch (obj.url) {
        case ('customer'):
            return async (dispatch) => {
                delete obj.url;
                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await searchCustomer(obj);
                if (res.status === "success") {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: res.body })
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    console.log("Error!", "Disconnected, login again", "error")
                }
            }
        case ('branch'):
            return async (dispatch) => {
                delete obj.url;
                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await searchBranches(obj);
                if (res.status === "success") {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: res.body })
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    console.log("Error!", "Disconnected, login again", "error")
                }
            }
        case ('user'):
            return async (dispatch) => {
                delete obj.url;
                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await searchUsers(obj);
                if (res.status === "success") {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: res.body })
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    console.log("Error!", "Disconnected, login again", "error")
                }
            }
        case ('loan'):
            return async (dispatch) => {
                delete obj.url;
                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await searchLoan(obj);
                if (res.status === "success") {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: res.body })
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    console.log("Error!", "Disconnected, login again", "error")
                }
            }
        case ('application'):
            return async (dispatch) => {
                delete obj.url;
                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await searchApplication(obj);
                if (res.status === "success") {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: res.body })
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    console.log("Error!", "Disconnected, login again", "error")
                }
            }
        case ('actionLogs'):
            return async (dispatch) => {
                delete obj.url;
                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await searchActionLogs(obj);
                if (res.status === "success") {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: res.body })
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    console.log("Error!", "Disconnected, login again", "error")
                }
            }
        case ('lead'):
            return async (dispatch) => {
                delete obj.url;
                dispatch({ type: 'SET_LOADING', payload: true })
                const res = await searchLeads(obj);
                if (res.status === "success") {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    dispatch({ type: 'SEARCH', payload: res.body })
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    console.log("Error!", "Disconnected, login again", "error")
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