import axiosLib from 'axios';

// function getCookie(cname: string) {
//     const name = cname + "=";
//     const ca = document.cookie.split(';');
//     for (let i = 0; i < ca.length; i++) {
//       let c = ca[i];
//       while (c.charAt(0) == ' ') {
//         c = c.substring(1);
//       }
//       if (c.indexOf(name) == 0) {
//         return c.substring(name.length, c.length);
//       }
//     }
//     return "";
//   }
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
            localStorage.clear();
            window.location.reload()
        default:
            break;
    }
    throw error;
}
var instance = axiosLib.create({
    headers: { 'Authorization': `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNzFlMTIxODc4OGVjYzBlYzk2YmY4OSIsImJyYW5jaCI6IjVlNjY0YWJiZDBlNmM3YzJlZDA3OWFlNiIsImV4cCI6MTU4NDUyNzEwOTAwMH0.h24I6WUUgiZQUZZ9tJS7n6UHoMHekx_lN8MW-FACz4GlPJARxwknwSHLJOD-5caaLrgcGYr87aA2ikYUDCKBKw` }
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
