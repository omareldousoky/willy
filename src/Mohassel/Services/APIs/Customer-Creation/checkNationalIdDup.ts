import axios from '../axios-instance';

export const checkNationalIdDuplicates = async (nationalId: string) => {
    const url = 'http://api.dev.halan.io' + `/customer/checkNID?nationalId=${nationalId}`;
    try {
        const res = await axios.get(url);
        console.log(res);
        return { status: "success", body: res.data.data }
    }
    catch (error) {
        console.log(error);
        return { status: "error", error: error.response.data }
    }
}