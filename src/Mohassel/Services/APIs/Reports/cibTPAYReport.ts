import axios from 'axios';

export const cibTPAYReport = async (url: string) => {
    try {
        const res = await axios({ url: url, method: 'GET', responseType: 'blob' })
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}