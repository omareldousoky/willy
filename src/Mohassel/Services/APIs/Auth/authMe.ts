import axios from '../axios-instance';
import { getCookie } from '../../../../Shared/Services/getCookie';

export const authMe = async () => {
    const url = process.env.REACT_APP_BASE_URL + '/auth/me';
    try {
        const res = await axios.get(url);
        if (!getCookie('ltsbranch')) {
            if (res.data.validBranches && res.data.validBranches.length > 0) {
                document.cookie = 'ltsbranch=' + JSON.stringify(res.data.validBranches[0]) + (process.env.REACT_APP_DOMAIN ? `;domain=${process.env.REACT_APP_DOMAIN}` : '') + ';path=/;';
            } else {
                document.cookie = `ltsbranch=;domain=${process.env.REACT_APP_DOMAIN}` + ';path=/;';
            }
        } else {
            const currentBranch = JSON.parse(getCookie('ltsbranch'))._id;
            if (res.data.validBranches && res.data.validBranches.length > 0) {
                const foundBranch = res.data.validBranches?.find(el => el._id === currentBranch)
                if (!foundBranch && currentBranch !== 'hq') {
                    document.cookie = 'ltsbranch=' + JSON.stringify(res.data.validBranches[0]) + (process.env.REACT_APP_DOMAIN ? `;domain=${process.env.REACT_APP_DOMAIN}` : '') + ';path=/;';
                }
            } else {
                document.cookie = `ltsbranch=;domain=${process.env.REACT_APP_DOMAIN}` + ';path=/;';
            }
        }
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}