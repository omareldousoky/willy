
import {
    EDIT_BRANCH,
    GET_BRANCH,
    CREATE_BRANCH,
} from './types';

// not completed yet


import {createBranch} from '../../../Mohassel/Services/APIs/Branch/createBranch';
import {editBranch} from '../../../Mohassel/Services/APIs/Branch/editBranch'
import { Branch } from '../../Services/interfaces';
import {getBranch} from '../../../Mohassel/Services/APIs/Branch/getBranch';
export function  createNewBranch(newBranch: Branch) {
    return async (dispatch)  => {
        dispatch({type: 'SET_LOADING', payload: true})
        const res =  await createBranch(newBranch);
        if(res.status === "success") {
            dispatch({type: 'SET_LOADING', payload: false })
            dispatch({type: CREATE_BRANCH, payload: {body: res.body , status: res.status}})
          

        }
         else{
             dispatch({type: 'SET_LOADING', payload: false})
             dispatch({type: CREATE_BRANCH, payload: {error: res.error , status: res.status}})
         }   
    }
}

export function editBranchById(branch: Branch ,_id: string) {
    return async(dispatch) => {
            dispatch({
                type:'SET_LOADING',
                payload: true
            })
            const res = await editBranch(branch, _id);
            if(res.status === "success")  {
                dispatch({type: 'SET_LOADING', payload: false })
                dispatch({type: EDIT_BRANCH, payload: {body: res.body , status: res.status}})
            } else {
                dispatch({type: 'SET_LOADING', payload: false})
                dispatch({type: EDIT_BRANCH, payload: {error: res.error , status: res.status}})
            }
    }
}

export function getBranchById( _id: string) {
    return async(dispatch) => {
        dispatch({
            type:'SET_LOADING',
            payload: true
        })
        const res = await getBranch( _id);
        if(res.status === "success")  {
            dispatch({type: 'SET_LOADING', payload: false })
            dispatch({type: GET_BRANCH, payload: {body: res.body , status: res.status}})
        } else {
            dispatch({type: 'SET_LOADING', payload: false})
            dispatch({type: GET_BRANCH, payload: {error: res.error , status: res.status}})
        }
}
}