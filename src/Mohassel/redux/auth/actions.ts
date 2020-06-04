import { authMe } from '../../Services/APIs/Auth/authMe';

export const getAuthData = () => {
    return async (dispatch) => {
        const res = await authMe();
        if (res.status === "success") {
            dispatch({ type: 'ADD_AUTH_DATA', payload: res.body })
        } else console.log("Error!", "Disconnected, login again", "error")
    }
}