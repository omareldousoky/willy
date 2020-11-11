export function setToken(token) {
    //;domain=.halan.io
    document.cookie = "token=" + token + (process.env.REACT_APP_DOMAIN ? `;domain=${process.env.REACT_APP_DOMAIN}`: '') + ';path=/;';
}
