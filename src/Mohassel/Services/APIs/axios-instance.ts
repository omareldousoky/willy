import axiosLib from 'axios';

function errorResponseHandler(error: any) {

    // check for errorHandle config
    if (error.config.hasOwnProperty('errorHandle') || error.config.errorHandle === false) {
        return Promise.reject(error);
    }
    // if has response show the error
    switch (error.response.status) {
        case 400:
        case 401:
        case 402:
            // localStorage.clear();
            // window.location.reload()
        default:
            break;
    }
    throw error;
}
var instance = axiosLib.create({
    headers: { 'Authorization': `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNzFlMTIxODc4OGVjYzBlYzk2YmY4OSIsImJyYW5jaCI6IjVlNjY0YWJiZDBlNmM3YzJlZDA3OWFlNiIsImV4cCI6MTU4NDY2MTE2MTAwMH0.XL7cL5wZlLzl_JPIgzQkysLUo5ksPmo3lyogW9fK3dRxJeYTV2nOmskQyn7LOgwrFbmFfhbxoOlx_Xw_WspUpA` }
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
