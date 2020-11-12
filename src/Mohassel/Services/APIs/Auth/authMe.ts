import axios from '../axios-instance';

export const authMe = async () => {
    const url = process.env.REACT_APP_BASE_URL + '/auth/me';
    try {
        const res = await axios.get(url);
        if (res.data.validBranches && res.data.validBranches.length > 0) {
            document.cookie = 'ltsbranch=' + JSON.stringify(res.data.validBranches[0]) + (process.env.REACT_APP_LTS_SUBDOMAIN ? `;domain=${process.env.REACT_APP_LTS_SUBDOMAIN}` : '' + ';path=/;');
        } else {
            document.cookie = "ltsbranch=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        }
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}