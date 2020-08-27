export function setToken(token) {
    //;domain=.halan.io
    document.cookie = "token=" + token + ";path=/;";
    // document.cookie = "token=" + token + ";domain=.halan.io;path=/;";
}
