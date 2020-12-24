export const getCookie = (cookie: string): string => {
    if (document.cookie) {
        const allCookies = document.cookie.split(';');
        for (let i = 0; i < allCookies.length; i++) {
            const name = allCookies[i].split('=')[0].toLowerCase().trim();
            const value = allCookies[i].split('=')[1].trim();
            if (name === cookie) {
                return value;
            } else if (value === cookie) {
                return name;
            }
        }
    }
    return "";
}