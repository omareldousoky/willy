import { searchCustomer } from '../../Services/APIs/Customer-Creation/searchCustomer';
import { searchBranches } from '../../Services/APIs/Branch/searchBranches';
import { searchUsers } from '../../Services/APIs/Users/searchUsers';
import { searchLoan } from '../../Services/APIs/Loan/searchLoan';

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
    }

}