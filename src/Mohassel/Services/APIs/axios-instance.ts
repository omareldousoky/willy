import axiosLib from 'axios';

function errorResponseHandler(error) {

    // check for errorHandle config
    if (error.config.hasOwnProperty('errorHandle') || error.config.errorHandle === false) {
        return Promise.reject(error);
    }
    // if has response show the error
    switch (error.response.status) {
        case 400:
            break;
        case 401:
            break;
        case 402:
            localStorage.clear();
            window.location.reload()
            break;
        case 403:
            break;
        case 404:
            break;
        case 405:
            localStorage.clear();
            window.location.reload()
            break;
        case 406:
            localStorage.clear();
            window.location.reload()
            break;
        case 409:
            break;
        default:
            break;
    }
    throw error;
}
var instance = axiosLib.create({
    headers: { 'Authorization': `Bearer ${collectSessionData && collectSessionData().token}` }, "Content-Type": "application/json",
})
// apply interceptor on response
instance.interceptors.response.use(
    response => response,
    errorResponseHandler
);

export default instance;


//to ignore default error handlers use for example axios.post(
    //     url,
    //     requestData,
    //     { errorHandle: false }
    // );
