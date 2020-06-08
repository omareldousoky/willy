import { Auth } from './types';

export const authReducer = (state: Auth = { loading: true }, action) => {
    switch (action.type) {
        case 'ADD_AUTH_DATA':
            const clientPermissions = JSON.parse(action.payload.clientPermissions);
            return {
                ...state,
                clientPermissions: clientPermissions,
                roles: action.payload.roles,
                validBranches: action.payload.validBranches,
                loading: false
            }
        default:
            return state;
    }
}