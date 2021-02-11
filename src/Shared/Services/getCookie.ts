export const getCookie = (cookie: string): string => {
  if (document.cookie) {
    const allCookies = document.cookie.split(";");
    for (let i = 0; i < allCookies.length; i++) {
      const name = allCookies[i].split("=")[0].toLowerCase().trim();
      const value = allCookies[i].split("=")[1].trim();
      if (name === cookie) {
        return value;
      } else if (value === cookie) {
        return name;
      }
    }
  }
  return "";
};

// clear all cookies
export const clearAllCookies = () => {
  const cookies = document.cookie.split("; ");
  cookies.forEach((cookie) => {
    const domain = window.location.hostname.split(".");
    while (domain.length) {
      const cookieBase = `${encodeURIComponent(
        cookie.split(";")[0].split("=")[0]
      )}=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=${domain.join(
        "."
      )} ;path=`;
      const path = location.pathname.split("/");
      document.cookie = `${cookieBase}/`;
      while (path.length) {
        document.cookie = cookieBase + path.join("/");
        path.pop();
      }
      domain.shift();
    }
  });
};
