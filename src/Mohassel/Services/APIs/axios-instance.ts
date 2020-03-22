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
function getCookie(cookie: string) {
  if(document.cookie){
    const allCookies = document.cookie.split(';');
  for (let i = 0; i < allCookies.length; i++) {
    const name = allCookies[i].split('=')[0].toLowerCase().trim();
    const value = allCookies[i].split('=')[1].trim();
    if (name === cookie) {
      return value;
    } else if (value === cookie) {
      return name;
    }}
  }
  return "";
};

const instance = axiosLib.create({
    headers: { 'Authorization': `Bearer ${getCookie('token')}` }
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
