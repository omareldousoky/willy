export function setToken(token) {
    //;domain=.halan.io
    document.cookie = "token=" + token + ";path=/;";
}