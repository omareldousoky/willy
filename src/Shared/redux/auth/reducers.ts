import { getCookie } from '../../Services/getCookie';
import { parseJwt } from '../../Services/utils';
import { Auth } from './types';

export const authReducer = (state: Auth = { loading: true, validBranches:[] }, action) => {
    switch (action.type) {
        case 'ADD_AUTH_DATA':
            const clientPermissions = JSON.parse(action.payload.clientPermissions);
            const token = getCookie('token');
            const tokenData = parseJwt(token);
            return {
                ...state,
                clientPermissions: clientPermissions,
                roles: action.payload.roles,
                validBranches: action.payload.validBranches,
                name: action.payload.name,
                loading: false,
                requireBranch: tokenData?.requireBranch
            }
        default:
            return state;
    }
}