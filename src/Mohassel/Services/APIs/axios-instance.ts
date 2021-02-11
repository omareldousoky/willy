import axiosLib from "axios";
import { getCookie } from "../../../Shared/Services/getCookie";

function errorResponseHandler(error: any) {
  // check for errorHandle config
  if (
    error.config.hasOwnProperty("errorHandle") ||
    error.config.errorHandle === false
  ) {
    return Promise.reject(error);
  }
  // if has response show the error
  switch (error.response.status) {
    // case 400:
    case 401:
      document.cookie = "token=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = process.env.REACT_APP_LOGIN_URL || "";
      break;
    case 402:
    // localStorage.clear();
    // window.location.reload()
    default:
      break;
  }
  throw error;
}

const instance = axiosLib.create({
  headers: { Authorization: `Bearer ${getCookie("token")}` },
});
// apply interceptor on response
instance.interceptors.response.use(
  (response) => response,
  errorResponseHandler
);
const isEmptyResponse = (value: unknown) => {
  const isObject = typeof value === "object";
  const isArray = Array.isArray(value);
  if (!isObject && !isArray) return false;
  if (isObject) {
    const valueObj = value as Record<string, unknown>;
    return !Object.keys(valueObj).length;
  }
  if (isArray) return !(value as unknown[]).length;
};
instance.interceptors.response.use(
  (res) => {
    if (res.config.url?.includes("/auth/context-branch/")) {
      instance.defaults.headers = { Authorization: `Bearer ${res.data.token}` };
    }
    if (res.config.url?.includes("/report")) {
      return {
        ...res,
        data: !isEmptyResponse(res.data) ? res.data : undefined,
      };
    }
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
