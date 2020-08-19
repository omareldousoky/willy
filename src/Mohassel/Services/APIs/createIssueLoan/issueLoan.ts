import axios from '../axios-instance';
interface LoanIssuanceObj {
    id: string;
    loanIssuanceDate:number;
    fieldManagerId?: string;
    managerVisitDate?: number;
}
export const issueLoan = async (obj: LoanIssuanceObj) => {
    const url = process.env.REACT_APP_BASE_URL + `/application/issue/${obj.id}`;
    try {
        const res = await axios.put(url, obj);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}