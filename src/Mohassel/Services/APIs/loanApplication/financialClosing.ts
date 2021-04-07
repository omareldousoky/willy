import axios from '../axios-instance';

interface FinancialClosingObj {
    closeDate: number;
}
export interface FinancialBlockingObj {
    blockDate: number;
    branchesIds: string[];
}
interface FinancialUnBlockingObj {
    branchesIds: string[]; 
}
interface BlockingSearchObj{
    from: number;
    size: number;
    branchCode?: string;
    branchName?: string;
    status?: string;
    blockDate?: number;
    blockDateFilter?: string;
}
export const financialClosing = async (data: FinancialClosingObj) => {
    const url = process.env.REACT_APP_BASE_URL + '/application/financial-close';
    try {
        const res = await axios.post(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}

export const financialBlocking = async (data: FinancialBlockingObj) => {
    const url = process.env.REACT_APP_BASE_URL + '/application/financial-block';
    try {
        const res = await axios.post(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
}
 export const financialUnlBlocking = async (data: FinancialUnBlockingObj) => {
    const url = process.env.REACT_APP_BASE_URL + '/application/financial-unblock';
    try {
        const res = await axios.post(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
 }
 export const searchFinancialBlocking = async (data) => {
    const url = process.env.REACT_APP_BASE_URL + '/search/financial-blocking';
    try {
        const res = await axios.post(url, data);
        return { status: "success", body: res.data }
    }
    catch (error) {
        return { status: "error", error: error.response.data }
    }
 }